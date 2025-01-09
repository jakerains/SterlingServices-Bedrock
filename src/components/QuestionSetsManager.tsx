import { useState } from 'react';
import { useQuestionSets } from '../store/questionSets';
import QuestionEditor from './QuestionEditor';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { QuestionSet } from '../services/questionSets';

export default function QuestionSetsManager() {
  const { questionSets, deleteSet } = useQuestionSets();
  const [showEditor, setShowEditor] = useState(false);
  const [editingSet, setEditingSet] = useState<QuestionSet | undefined>();

  const handleEdit = (set: QuestionSet) => {
    setEditingSet(set);
    setShowEditor(true);
  };

  const handleClose = () => {
    setShowEditor(false);
    setEditingSet(undefined);
  };

  return (
    <div>
      {/* Question Sets List */}
      <div className="space-y-4">
        {questionSets.map((set) => (
          <div key={set.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{set.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{set.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(set)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  aria-label={`Edit ${set.name}`}
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteSet(set.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  aria-label={`Delete ${set.name}`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Set Button */}
      <button
        onClick={() => setShowEditor(true)}
        className="mt-6 w-full py-3 flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 border-2 border-dashed border-indigo-200 hover:border-indigo-300 rounded-xl"
      >
        Create New Question Set
      </button>

      {/* Question Set Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              <QuestionEditor 
                onClose={handleClose} 
                questionSetToEdit={editingSet} 
              />
            </div>
          </div>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </div>
      )}
    </div>
  );
}