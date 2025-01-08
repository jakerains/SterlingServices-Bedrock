import { XMarkIcon } from '@heroicons/react/24/outline';
import { QuestionSet } from '../store/questionSets';

interface QuestionSetViewerProps {
  set: QuestionSet;
  onClose: () => void;
}

export default function QuestionSetViewer({ set, onClose }: QuestionSetViewerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{set.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{set.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg"
            aria-label="Close viewer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {set.questions.project_questions.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="pl-4 border-l-2 border-indigo-100">
                    <p className="text-gray-700">{question.text}</p>
                    {question.instruction && (
                      <div className="mt-2 flex items-start gap-2">
                        <span className="flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full">
                          Instructions
                        </span>
                        <p className="text-sm text-gray-500">{question.instruction}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 