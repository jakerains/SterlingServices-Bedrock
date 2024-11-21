import { useEffect } from 'react';
import { useFileStore } from '../store/file';
import { useResults } from '../store/results';
import { useQuestions } from '../store/questions';
import { processFile } from '../services/fileProcessing';
import toast from 'react-hot-toast';

// Debug logger helper
const debug = (component: string, action: string, data?: any) => {
  console.log(`[${component}] ${action}`, data || '');
};

export default function useFileProcessing() {
  const { file, processing, completed, setProcessing, setCompleted } = useFileStore();
  const { setResults } = useResults();
  const questions = useQuestions((state) => state.questions);

  useEffect(() => {
    if (file && !processing && !completed) {
      const process = async () => {
        try {
          setProcessing(true);
          const results = await processFile(file, questions);
          
          if (results) {
            setResults(results);
            setCompleted(true);
            toast.success('Processing completed successfully');
          }
        } catch (error) {
          debug('FileProcessing', 'Processing error', { error });
          
          const errorMessage = error.message || 'Unknown error occurred';
          if (!errorMessage.includes('Failed to delete file from S3')) {
            if (errorMessage.includes('AccessDenied')) {
              toast.error('AWS access denied - check your permissions');
            } else if (errorMessage.includes('credentials')) {
              toast.error('Invalid AWS credentials');
            } else if (errorMessage.includes('NetworkError')) {
              toast.error('Network error - check your internet connection');
            } else {
              toast.error(`Error: ${errorMessage}`);
            }
          }
        } finally {
          setProcessing(false);
        }
      };

      process();
    }
  }, [file, processing, completed, questions, setProcessing, setCompleted, setResults]);
}