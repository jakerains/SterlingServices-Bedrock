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
    if (!questions?.project_questions?.length) {
      debug('FileProcessing', 'No questions loaded', { questions });
      toast.error('Error: Questions not loaded properly');
      return;
    }

    if (file && !processing && !completed) {
      debug('FileProcessing', 'Starting processing', { 
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const process = async () => {
        try {
          setProcessing(true);
          const results = await processFile(file, questions);
          
          if (results) {
            setResults(results);
            setCompleted(true);
            toast.success('Processing completed successfully');
            debug('FileProcessing', 'Processing completed', { 
              resultsLength: results.length 
            });
          }
        } catch (error: any) {
          debug('FileProcessing', 'Processing error', { 
            error: error.message,
            stack: error.stack
          });
          
          const errorMessage = error.message || 'Unknown error occurred';
          
          if (errorMessage.includes('Missing required AWS configuration')) {
            toast.error('AWS configuration missing - check your environment variables');
          } else if (errorMessage.includes('Missing required Groq configuration')) {
            toast.error('Groq configuration missing - check your environment variables');
          } else if (errorMessage.includes('NetworkError')) {
            toast.error('Network error - check your internet connection');
          } else if (errorMessage.includes('Transcription failed')) {
            toast.error('Audio transcription failed - please try again');
          } else if (errorMessage.includes('Analysis failed')) {
            toast.error('Content analysis failed - please try again');
          } else {
            toast.error(`Error: ${errorMessage}`);
          }
        } finally {
          setProcessing(false);
        }
      };

      process();
    }
  }, [file, processing, completed, questions, setProcessing, setCompleted, setResults]);
}