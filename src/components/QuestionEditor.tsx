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
      <QuestionSetsManager open={false} setOpen={() => {}} />
      
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

      {isEditing && (
        <div className="space-y-6">
          {editedQuestions.project_questions.map((category, categoryIndex) => (
            <div key={categoryIndex} className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={category.category}
                  onChange={(e) => {
                    const newQuestions = { ...editedQuestions };
                    newQuestions.project_questions[categoryIndex].category = e.target.value;
                    setEditedQuestions(newQuestions);
                  }}
                  className="text-lg font-semibold text-gray-900 border-b border-transparent focus:border-indigo-600 focus:outline-none"
                />
                <button
                  onClick={() => handleAddQuestion(categoryIndex)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {category.questions.map((question: any, questionIndex: number) => (
                  <div key={questionIndex} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <input
                        type="text"
                        value={typeof question === 'string' ? question : question.text}
                        onChange={(e) => {
                          const newQuestions = { ...editedQuestions };
                          if (typeof question === 'string') {
                            newQuestions.project_questions[categoryIndex].questions[questionIndex] = e.target.value;
                          } else {
                            newQuestions.project_questions[categoryIndex].questions[questionIndex].text = e.target.value;
                          }
                          setEditedQuestions(newQuestions);
                        }}
                        className="flex-1 p-2 border rounded-md"
                        placeholder="Question text"
                      />
                      <button
                        onClick={() => {
                          const newQuestions = { ...editedQuestions };
                          newQuestions.project_questions[categoryIndex].questions.splice(questionIndex, 1);
                          setEditedQuestions(newQuestions);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {typeof question !== 'string' && (
                      <textarea
                        value={question.instruction || ''}
                        onChange={(e) => {
                          const newQuestions = { ...editedQuestions };
                          newQuestions.project_questions[categoryIndex].questions[questionIndex].instruction = e.target.value;
                          setEditedQuestions(newQuestions);
                        }}
                        className="w-full p-2 text-sm border rounded-md"
                        placeholder="Model instructions (optional)"
                        rows={2}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" />
              Add Category
            </button>
            <button
              onClick={handleSaveQuestions}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}