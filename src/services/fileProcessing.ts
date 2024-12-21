import { analyzeWithBedrock } from './aws';
import { transcribeAudio } from './groq';
import toast from 'react-hot-toast';
import { useFileStore } from '../store/file';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Debug logger helper
const debug = (service: string, action: string, data?: any) => {
  console.log(`[FileProcessing:${service}]`, action, data || '');
};

// Supported audio formats
const SUPPORTED_AUDIO_FORMATS = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/m4a',
  'audio/x-m4a',
  'audio/x-mp3',
  'audio/aac'
];

export async function processFile(file: File, questions: any) {
  const { setCurrentStep, setStatusMessage, setProgress } = useFileStore.getState();
  let results = null;
  
  try {
    // Validate file type
    const isAudioFile = SUPPORTED_AUDIO_FORMATS.includes(file.type);
    const isTextFile = file.type.startsWith('text/');
    
    if (!isAudioFile && !isTextFile) {
      const error = `Invalid file type: ${file.type}. Please upload an audio file (MP3, WAV, M4A) or text file.`;
      debug('Process', 'File type validation failed', { fileType: file.type });
      throw new Error(error);
    }

    debug('Process', 'Starting file processing', { 
      fileName: file.name, 
      fileType: file.type,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB` 
    });

    // Process based on file type
    let text = '';
    if (isAudioFile) {
      setCurrentStep('transcribe');
      setStatusMessage('Starting audio transcription...');
      setProgress(0);

      try {
        // Use Groq's Whisper model for transcription
        debug('Process', 'Starting transcription');
        text = await transcribeAudio(file, setProgress, setStatusMessage);
        debug('Process', 'Transcription completed', { textLength: text.length });
      } catch (error: any) {
        debug('Process', 'Transcription failed', { error });
        throw new Error(`Transcription failed: ${error.message}`);
      }
    } else {
      // For text files, read directly
      try {
        text = await file.text();
        debug('Process', 'Text file read', { textLength: text.length });
      } catch (error: any) {
        debug('Process', 'Failed to read text file', { error });
        throw new Error(`Failed to read text file: ${error.message}`);
      }
    }

    // Analyze with Bedrock
    setCurrentStep('analyze');
    setStatusMessage('Initializing content analysis...');
    setProgress(0);
    
    try {
      debug('Process', 'Starting Bedrock analysis');
      results = await analyzeWithBedrock(
        text, 
        questions,
        setStatusMessage,
        setProgress
      );
      setStatusMessage('Analysis completed, preparing final results...');
      setProgress(100);
      toast.success('Analysis completed');
      debug('Process', 'Bedrock analysis completed', { 
        categories: results.length,
        textLength: text.length 
      });
    } catch (error: any) {
      debug('Process', 'Bedrock analysis failed', { error });
      throw new Error(`Analysis failed: ${error.message}`);
    }

    // Generate final document
    setCurrentStep('generate');
    setStatusMessage('Generating final document...');
    setProgress(100);
    setStatusMessage('Document generation complete');
    await sleep(1000);
    
    debug('Process', 'File processing completed successfully');
    return results;
  } catch (error) {
    console.error('Error processing file:', error);
    setStatusMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    toast.error(error instanceof Error ? error.message : 'Error processing file');
    throw error;
  }
}