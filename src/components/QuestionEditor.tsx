import { useState, useEffect } from 'react';
import { useQuestionSets } from '../store/questionSets';
import {
  XMarkIcon,
  TrashIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { defaultQuestions } from '../store/questionSets';

interface QuestionEditorProps {
  onClose: () => void;
}

export default function QuestionEditor({ onClose }: QuestionEditorProps) {
  const { sets, activeSetId, updateSet } = useQuestionSets();
  const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});
  
  // Get the active set or use default if it's the default set
  const activeSet = activeSetId === 'default' 
    ? {
        id: 'default',
        name: 'Default Analysis Set',
        description: 'Standard set of questions for analyzing meeting content',
        questions: defaultQuestions
      }
    : sets.find((set) => set.id === activeSetId)!;

  const [editedSet, setEditedSet] = useState({
    name: activeSet.name,
    description: activeSet.description || '',
    questions: activeSet.questions
  });

  // Expand all categories by default
  useEffect(() => {
    const initialExpanded = activeSet.questions.project_questions.reduce((acc, _, index) => {
      acc[index] = true;
      return acc;
    }, {} as { [key: number]: boolean });
    setExpandedCategories(initialExpanded);
  }, [activeSet]);

  const handleAddCategory = () => {
    const newQuestions = { ...editedSet.questions };
    newQuestions.project_questions.push({
      category: 'New Category',
      questions: [{
        text: 'New Question',
        instruction: 'Enter instruction here'
      }]
    });
    setEditedSet(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleAddQuestion = (categoryIndex: number) => {
    const newQuestions = { ...editedSet.questions };
    newQuestions.project_questions[categoryIndex].questions.push({
      text: 'New Question',
      instruction: 'Enter instruction here'
    });
    setEditedSet(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleSaveQuestions = async () => {
    if (activeSetId === 'default') {
      toast.error('Cannot modify the default template');
      return;
    }

    if (!editedSet.name.trim()) {
      toast.error('Set name cannot be empty');
      return;
    }

    try {
      await updateSet(activeSetId, {
        name: editedSet.name,
        description: editedSet.description,
        questions: editedSet.questions
      });
      
      toast.success('Changes saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save changes');
      console.error('Save error:', error);
    }
  };

  const isDefaultSet = activeSetId === 'default';

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-xl shadow-sm">
      {/* Header with Buttons */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isDefaultSet ? 'View Default Template' : 'Edit Question Set'}
          </h2>
          {isDefaultSet && (
            <p className="mt-1 text-sm text-purple-600">
              This is the default template. You can use it as a reference but cannot modify it.
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 rounded-lg text-gray-700 bg-white shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <XMarkIcon className="h-5 w-5 mr-1.5 text-gray-500" />
            Close
          </button>
          {!isDefaultSet && (
            <button
              onClick={handleSaveQuestions}
              className="inline-flex items-center px-6 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              <svg 
                className="w-5 h-5 mr-1.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" 
                />
              </svg>
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Set Title and Description Section */}
      <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="setName" className="block text-sm font-medium text-gray-700 mb-1">
              Set Name
            </label>
            <input
              id="setName"
              type="text"
              value={editedSet.name}
              onChange={(e) => setEditedSet(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Enter set name"
              disabled={isDefaultSet}
            />
          </div>
          <div>
            <label htmlFor="setDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="setDescription"
              value={editedSet.description}
              onChange={(e) => setEditedSet(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Enter set description"
              rows={2}
              disabled={isDefaultSet}
            />
          </div>
        </div>
      </div>

      {/* Categories Section Title */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Questions and Categories
        </h3>
      </div>

      {/* Categories and Questions */}
      <div className="space-y-4">
        {editedSet.questions.project_questions.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => setExpandedCategories(prev => ({
                    ...prev,
                    [categoryIndex]: !prev[categoryIndex]
                  }))}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label={expandedCategories[categoryIndex] ? "Collapse category" : "Expand category"}
                >
                  {expandedCategories[categoryIndex] ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </button>
                <div className="flex-1">
                  <label className="sr-only" htmlFor={`category-${categoryIndex}`}>
                    Category name
                  </label>
                  <input
                    id={`category-${categoryIndex}`}
                    type="text"
                    value={category.category}
                    onChange={(e) => {
                      const newQuestions = { ...editedSet.questions };
                      newQuestions.project_questions[categoryIndex].category = e.target.value;
                      setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                    }}
                    className="text-lg font-medium text-gray-900 border-none focus:ring-2 focus:ring-indigo-500 rounded-md w-full disabled:bg-transparent"
                    placeholder="Category name"
                    disabled={isDefaultSet}
                  />
                </div>
              </div>
              {!isDefaultSet && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddQuestion(categoryIndex)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Add Question"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      const newQuestions = { ...editedSet.questions };
                      newQuestions.project_questions.splice(categoryIndex, 1);
                      setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                    }}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Delete Category"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {expandedCategories[categoryIndex] && (
              <div className="p-4 space-y-4">
                {category.questions.map((question: any, questionIndex: number) => (
                  <div key={questionIndex} className="pl-8 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <label className="sr-only" htmlFor={`question-${categoryIndex}-${questionIndex}`}>
                              Question text
                            </label>
                            <input
                              id={`question-${categoryIndex}-${questionIndex}`}
                              type="text"
                              value={typeof question === 'string' ? question : question.text}
                              onChange={(e) => {
                                const newQuestions = { ...editedSet.questions };
                                if (typeof question === 'string') {
                                  newQuestions.project_questions[categoryIndex].questions[questionIndex] = {
                                    text: e.target.value,
                                    instruction: ''
                                  };
                                } else {
                                  newQuestions.project_questions[categoryIndex].questions[questionIndex].text = e.target.value;
                                }
                                setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                              }}
                              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-transparent disabled:border-gray-100"
                              placeholder="Question text"
                              disabled={isDefaultSet}
                            />
                          </div>
                          {!isDefaultSet && (
                            <>
                              <button
                                onClick={() => {
                                  const newQuestions = { ...editedSet.questions };
                                  if (typeof question === 'string') {
                                    newQuestions.project_questions[categoryIndex].questions[questionIndex] = {
                                      text: question,
                                      instruction: ''
                                    };
                                  }
                                  setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                                }}
                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                title="Add Instructions"
                                aria-label="Add model instructions for this question"
                              >
                                <InformationCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => {
                                  const newQuestions = { ...editedSet.questions };
                                  newQuestions.project_questions[categoryIndex].questions.splice(questionIndex, 1);
                                  setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                                }}
                                className="p-1.5 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50"
                                title="Delete Question"
                                aria-label="Delete this question"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                        {(typeof question !== 'string' && question.instruction !== undefined) && (
                          <div className="pl-4 border-l-2 border-gray-200">
                            <label className="sr-only" htmlFor={`instruction-${categoryIndex}-${questionIndex}`}>
                              Model instructions
                            </label>
                            <textarea
                              id={`instruction-${categoryIndex}-${questionIndex}`}
                              value={question.instruction || ''}
                              onChange={(e) => {
                                const newQuestions = { ...editedSet.questions };
                                if (typeof question !== 'string') {
                                  newQuestions.project_questions[categoryIndex].questions[questionIndex].instruction = e.target.value;
                                }
                                setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                              }}
                              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 disabled:bg-gray-50"
                              placeholder="Add instructions to guide the model's response..."
                              rows={2}
                              aria-label="Model instructions for this question"
                              disabled={isDefaultSet}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Category Button */}
      {!isDefaultSet && (
        <div className="mt-6">
          <button
            onClick={handleAddCategory}
            className="inline-flex items-center gap-x-1.5 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>
        </div>
      )}
    </div>
  );
}