import { useCallback, useEffect } from 'react';
import { useFileStore } from '../store/file';
import { useResults } from '../store/results';
import { useQuestionStore } from '../store/questions';
import { processFile } from '../services/fileProcessing';
import toast from 'react-hot-toast';

// Debug logger helper
const debug = (action: string, data?: any) => {
  console.log('[FileProcessing]', action, data || '');
};

export default function useFileProcessing() {
  const { file, processing, completed, setProcessing, setCompleted } = useFileStore();
  const { setResults } = useResults();
  const questions = useQuestionStore(state => state.project_questions);

  useEffect(() => {
    debug('Effect triggered', { 
      hasFile: !!file, 
      processing, 
      completed,
      fileInfo: file ? { name: file.name, type: file.type, size: file.size } : null
    });

    if (file && !processing && !completed) {
      const process = async () => {
        try {
          debug('Starting file processing');
          setProcessing(true);
          
          // Validate questions structure
          if (!Array.isArray(questions)) {
            throw new Error('Questions not loaded');
          }
          
          debug('Processing file', { 
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            questionCount: questions.reduce((total, category) => total + category.questions.length, 0)
          });

          const results = await processFile(file, questions);
          
          if (results) {
            debug('Processing completed', { resultCount: results.length });
            setResults(results);
            setCompleted(true);
            toast.success('Processing completed successfully');
          }
        } catch (error: any) {
          debug('Processing error', { error });
          
          const errorMessage = error?.message || 'Unknown error occurred';
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
  }, [file, processing, completed, setProcessing, setCompleted, setResults, questions]);
}