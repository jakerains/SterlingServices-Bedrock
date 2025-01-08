import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseDocumentToQuestions } from '../services/questionParser';
import { useQuestionStore } from '../store/questions';
import toast from 'react-hot-toast';

interface QuestionSetImportProps {
  onSuccess?: () => void;
}

export default function QuestionSetImport({ onSuccess }: QuestionSetImportProps) {
  const setQuestions = useQuestionStore(state => state.setQuestions);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check file type
      if (!file.type.includes('text/') && 
          !file.type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        toast.error('Please upload a text or Word document');
        return;
      }

      toast.loading('Parsing question set...');
      const questions = await parseDocumentToQuestions(file);
      
      if (questions.length === 0) {
        toast.error('No questions found in document');
        return;
      }

      setQuestions(questions);
      toast.success(`Imported ${questions.length} categories with ${
        questions.reduce((sum, cat) => sum + cat.questions.length, 0)
      } questions`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error importing questions:', error);
      toast.error('Failed to import questions: ' + (error as Error).message);
    }
  }, [setQuestions, onSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-300 hover:border-indigo-400'}`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <div className="text-4xl">📄</div>
        {isDragActive ? (
          <p className="text-sm text-gray-600">Drop your question set here...</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Drag and drop a text or Word document containing your question set
            </p>
            <p className="text-xs text-gray-500">
              Format: Category name followed by questions starting with - or •
            </p>
            <p className="text-xs text-gray-500">
              Optional: Add [instruction: xyz] after any question
            </p>
          </>
        )}
      </div>
    </div>
  );
} 