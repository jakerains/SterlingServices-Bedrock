import { useState } from 'react';
import { useQuestionStore } from '../store/questions';
import QuestionSetImport from './QuestionSetImport';

export default function QuestionManager() {
  const [isImporting, setIsImporting] = useState(false);
  const questions = useQuestionStore(state => state.project_questions);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Question Set Manager</h2>
            <button
              onClick={() => setIsImporting(!isImporting)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isImporting ? 'Cancel Import' : 'Import Questions'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {isImporting ? (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Import Question Set</h3>
              <QuestionSetImport />
            </div>
          ) : null}

          <div className="space-y-6">
            {questions.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">{category.category}</h3>
                <div className="space-y-3">
                  {category.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="pl-4 border-l-2 border-gray-200">
                      <p className="text-gray-700">{question.text}</p>
                      {question.instruction && (
                        <p className="text-sm text-gray-500 mt-1">
                          Instruction: {question.instruction}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 