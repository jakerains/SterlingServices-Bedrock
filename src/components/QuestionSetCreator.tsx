import { useState } from 'react';
import { useQuestionStore } from '../store/questions';
import QuestionSetImport from './QuestionSetImport';
import { defaultQuestions } from '../store/questions';

export default function QuestionSetCreator({ onClose }: { onClose: () => void }) {
  const [selectedOption, setSelectedOption] = useState<'template' | 'import' | null>(null);
  const setQuestions = useQuestionStore(state => state.setQuestions);

  const handleTemplateSelect = () => {
    setQuestions(defaultQuestions);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create New Question Set</h2>
        <p className="mt-2 text-sm text-gray-600">Choose how you'd like to start</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template Option */}
        <div 
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all
            ${selectedOption === 'template' 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-200 hover:border-indigo-300'}`}
          onClick={() => setSelectedOption('template')}
        >
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-900">Use Template</h3>
            <p className="text-sm text-gray-600 mt-2">
              Start with our pre-defined question set template
            </p>
          </div>
          {selectedOption === 'template' && (
            <div className="mt-4">
              <button
                onClick={handleTemplateSelect}
                className="w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-500 transition-colors"
              >
                Use Template
              </button>
            </div>
          )}
        </div>

        {/* Import Option */}
        <div 
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all
            ${selectedOption === 'import' 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-200 hover:border-indigo-300'}`}
          onClick={() => setSelectedOption('import')}
        >
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">📄</div>
            <h3 className="font-semibold text-gray-900">Import Questions</h3>
            <p className="text-sm text-gray-600 mt-2">
              Import from a text or Word document
            </p>
          </div>
          {selectedOption === 'import' && (
            <div className="mt-4">
              <QuestionSetImport onSuccess={onClose} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 