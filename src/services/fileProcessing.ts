import {
  uploadToS3,
  startTranscription,
  getTranscriptionStatus,
  analyzeWithBedrock,
  deleteFromS3,
} from './aws';
import toast from 'react-hot-toast';
import { useFileStore } from '../store/file';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function processFile(file: File, questions: any) {
  const { setCurrentStep, setStatusMessage, setProgress } = useFileStore.getState();
  let fileName: string | null = null;
  let results = null;
  
  try {
    fileName = `upload_${Date.now()}_${file.name}`;
    const jobName = `job_${Date.now()}`;

    // Upload to S3
    setCurrentStep('upload');
    setStatusMessage('Uploading file to server...');
    setProgress(0);
    await uploadToS3(file, fileName);
    setProgress(100);
    toast.success('File uploaded successfully');

    // Process based on file type
    let text = '';
    if (file.type.startsWith('audio/')) {
      setCurrentStep('transcribe');
      setStatusMessage('Starting audio transcription...');
      setProgress(0);
      await startTranscription(fileName, jobName);
      toast.success('Transcription started');

      // Poll for transcription completion
      let pollCount = 0;
      while (true) {
        const status = await getTranscriptionStatus(jobName);
        const jobStatus = status.TranscriptionJob?.TranscriptionJobStatus;

        // Update progress based on status
        if (jobStatus === 'IN_PROGRESS') {
          pollCount++;
          // Simulate progress (actual progress not available from AWS)
          const estimatedProgress = Math.min(pollCount * 5, 90);
          setProgress(estimatedProgress);
          setStatusMessage('Transcribing audio... This may take a few minutes.');
        }

        if (jobStatus === 'COMPLETED') {
          setProgress(100);
          setStatusMessage('Transcription completed, processing results...');
          const response = await fetch(status.TranscriptionJob.Transcript?.TranscriptFileUri!);
          const data = await response.json();
          text = data.results.transcripts[0].transcript;
          toast.success('Transcription completed');
          break;
        } else if (jobStatus === 'FAILED') {
          throw new Error('Transcription failed');
        }
        await sleep(5000);
      }
    } else {
      // For text files, read directly
      text = await file.text();
    }

    // Analyze with Bedrock
    setCurrentStep('analyze');
    setStatusMessage('Initializing content analysis...');
    setProgress(0);
    
    results = await analyzeWithBedrock(
      text, 
      questions,
      setStatusMessage,
      setProgress
    );

    setStatusMessage('Analysis completed, preparing final results...');
    setProgress(100);
    toast.success('Analysis completed');

    // Generate final document
    setCurrentStep('generate');
    setStatusMessage('Generating final document...');
    setProgress(0);
    
    await sleep(1000);
    setProgress(100);
    setStatusMessage('Document generation complete');
    
    return results;
  } catch (error) {
    console.error('Error processing file:', error);
    setStatusMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    toast.error(error instanceof Error ? error.message : 'Error processing file');
    throw error;
  } finally {
    // Only attempt cleanup if we haven't successfully returned results
    if (fileName && !results) {
      try {
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