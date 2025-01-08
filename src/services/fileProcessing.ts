import {
  uploadToS3,
  startTranscription,
  getTranscriptionStatus,
  analyzeWithBedrock,
  deleteFromS3,
} from './aws';
import toast from 'react-hot-toast';
import { useFileStore } from '../store/file';

const debug = (action: string, data?: any) => {
  console.log('[FileProcessing]', action, data || '');
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function processFile(file: File, questions: any) {
  const { setCurrentStep, setStatusMessage, setProgress } = useFileStore.getState();
  let fileName: string | null = null;
  let results = null;
  
  try {
    debug('Starting file processing', { fileName: file.name, fileType: file.type });
    fileName = `upload_${Date.now()}_${file.name}`;
    const jobName = `job_${Date.now()}`;

    // Upload to S3
    setCurrentStep('upload');
    setStatusMessage('Uploading file to S3...');
    setProgress(0);
    debug('Uploading to S3', { fileName });
    await uploadToS3(file, fileName);
    setProgress(100);
    debug('S3 upload complete');
    toast.success('File uploaded to S3');

    // Process based on file type
    let text = '';
    if (file.type.startsWith('audio/')) {
      setCurrentStep('transcribe');
      setStatusMessage('Starting audio transcription...');
      setProgress(0);
      debug('Starting transcription', { jobName });
      await startTranscription(fileName, jobName);
      toast.success('Transcription started');

      // Poll for transcription completion
      let pollCount = 0;
      while (true) {
        debug('Checking transcription status', { jobName, pollCount });
        const status = await getTranscriptionStatus(jobName);
        const jobStatus = status.TranscriptionJob?.TranscriptionJobStatus;

        // Update progress based on status
        if (jobStatus === 'IN_PROGRESS') {
          pollCount++;
          const estimatedProgress = Math.min(pollCount * 5, 90);
          setProgress(estimatedProgress);
          setStatusMessage('Transcribing audio... This may take a few minutes.');
          debug('Transcription in progress', { estimatedProgress });
        }

        if (jobStatus === 'COMPLETED') {
          setProgress(100);
          setStatusMessage('Transcription completed, processing results...');
          debug('Transcription completed', { jobName });
          const response = await fetch(status.TranscriptionJob.Transcript?.TranscriptFileUri!);
          const data = await response.json();
          text = data.results.transcripts[0].transcript;
          debug('Got transcript', { length: text.length });
          toast.success('Transcription completed');
          break;
        } else if (jobStatus === 'FAILED') {
          throw new Error('Transcription failed');
        }
        await sleep(5000);
      }
    } else {
      throw new Error('Unsupported file type: ' + file.type);
    }

    // Analyze with Bedrock
    setCurrentStep('analyze');
    setStatusMessage('Analyzing content...');
    setProgress(0);
    debug('Starting Bedrock analysis');
    
    // Wrap questions in the expected format
    const wrappedQuestions = { project_questions: questions };
    
    results = await analyzeWithBedrock(
      text, 
      wrappedQuestions,
      setStatusMessage,
      setProgress
    );

    debug('Analysis completed', { resultCount: results.length });
    setStatusMessage('Analysis completed');
    setProgress(100);
    toast.success('Analysis completed');

    return results;
  } catch (error) {
    debug('Error processing file', { error });
    throw error;
  } finally {
    // Only attempt cleanup if we haven't successfully returned results
    if (fileName && !results) {
      try {
        debug('Cleaning up S3 file', { fileName });
        const deleted = await deleteFromS3(fileName);
        if (!deleted) {
          console.warn('Failed to clean up temporary file:', fileName);
        }
      } catch (error) {
        console.warn('Cleanup warning: Failed to delete temporary file', error);
      }
    }
  }
}