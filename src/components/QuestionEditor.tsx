import { useState } from 'react';
import { useQuestionSets } from '../store/questionSets';
import { useFileStore } from '../store/file';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import QuestionSetsManager from './QuestionSetsManager';

export default function QuestionEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const { sets, activeSetId, updateSet } = useQuestionSets();
  const { setProcessing } = useFileStore();
  
  const activeSet = sets.find((set) => set.id === activeSetId)!;
  const [editedQuestions, setEditedQuestions] = useState(activeSet.questions);

  const handleStartProcessing = () => {
    setProcessing(true);
    toast.success('Starting SOW generation...');
  };

  const handleAddCategory = () => {
    setEditedQuestions({
      project_questions: [
        ...editedQuestions.project_questions,
        {
          category: 'New Category',
          questions: ['New Question'],
        },
      ],
    });
  };

  const handleAddQuestion = (categoryIndex: number) => {
    const newQuestions = { ...editedQuestions };
    newQuestions.project_questions[categoryIndex].questions.push({
      text: 'New Question',
      instruction: '',
    });
    setEditedQuestions(newQuestions);
  };

  const handleSaveQuestions = () => {
    updateSet(activeSetId, { questions: editedQuestions });
    setIsEditing(false);
    toast.success('Questions saved successfully');
  };

  return (
    <div className="space-y-6">
      <QuestionSetsManager />
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PencilSquareIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          {isEditing ? 'Close Editor' : 'Edit Questions'}
        </button>
        {!isEditing && (
          <button
            onClick={handleStartProcessing}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <ArrowPathIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Start Processing
          </button>
        )}
      </div>

      {/* Rest of the QuestionEditor component remains the same */}
      {isEditing && (
        <div className="space-y-6">
          {/* Existing question editor UI */}
        </div>
      )}
    </div>
  );
}