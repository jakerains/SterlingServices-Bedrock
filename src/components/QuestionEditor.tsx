import { useState, useEffect } from 'react';
import { useQuestionSets } from '../store/questionSets';
import {
  XMarkIcon,
  PencilSquareIcon,
  ArrowUpTrayIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import './ResultsDisplay.css';
import type { QuestionSet } from '../services/questionSets';

interface QuestionEditorProps {
  onClose: () => void;
  questionSetToEdit?: QuestionSet;
}

type View = 'initial' | 'manual' | 'import';

export default function QuestionEditor({ onClose, questionSetToEdit }: QuestionEditorProps) {
  const [view, setView] = useState<View>(questionSetToEdit ? 'manual' : 'initial');
  const { addSet, updateSet } = useQuestionSets();
  const [showInstructionInput, setShowInstructionInput] = useState<{ categoryIndex: number; questionIndex: number } | null>(null);
  
  // Initialize editedSet with questionSetToEdit if provided
  const [editedSet, setEditedSet] = useState(questionSetToEdit || {
    name: '',
    description: '',
    questions: {
      project_questions: [{
        category: 'New Category',
        questions: [{
          text: 'New Question',
          instruction: ''
        }]
      }]
    }
  });

  // Force view to manual when questionSetToEdit is provided
  useEffect(() => {
    if (questionSetToEdit) {
      setView('manual');
    }
  }, [questionSetToEdit]);

  const handleAddCategory = () => {
    setEditedSet(prev => ({
      ...prev,
      questions: {
        project_questions: [
          ...prev.questions.project_questions,
          {
            category: 'New Category',
            questions: [{
              text: 'New Question',
              instruction: ''
            }]
          }
        ]
      }
    }));
  };

  const handleAddQuestion = (categoryIndex: number) => {
    const newQuestions = { ...editedSet.questions };
    newQuestions.project_questions[categoryIndex].questions.push({
      text: 'New Question',
      instruction: ''
    });
    setEditedSet(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleSaveSet = async () => {
    if (!editedSet.name.trim()) {
      toast.error('Set name cannot be empty');
      return;
    }

    try {
      if (questionSetToEdit) {
        await updateSet(questionSetToEdit.id, editedSet);
        toast.success('Question set updated successfully');
      } else {
        await addSet(editedSet);
        toast.success('Question set created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(questionSetToEdit ? 'Failed to update question set' : 'Failed to create question set');
      console.error('Save error:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Here we'll handle the file upload and parsing
      // For now, just show a success message
      toast.success('File uploaded successfully');
      // TODO: Implement file parsing
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const toggleInstructionInput = (categoryIndex: number, questionIndex: number) => {
    if (showInstructionInput?.categoryIndex === categoryIndex && showInstructionInput?.questionIndex === questionIndex) {
      setShowInstructionInput(null);
    } else {
      setShowInstructionInput({ categoryIndex, questionIndex });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {view !== 'initial' && !questionSetToEdit && (
            <button
              onClick={() => setView('initial')}
              className="glow-base glow-action p-2 text-gray-400 hover:text-gray-500 rounded-lg bg-white"
              aria-label="Go back"
            >
              <div className="flex items-center justify-center">
                <ArrowLeftIcon className="h-5 w-5" />
              </div>
            </button>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {questionSetToEdit ? 'Edit Question Set' : (
                view === 'initial' ? 'Create New Question Set' :
                view === 'manual' ? 'Create Question Set' :
                'Import Questions'
              )}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {questionSetToEdit ? 'Modify your existing question set' : (
                view === 'initial' ? 'Choose how you want to create your new question set' :
                view === 'manual' ? 'Add categories and questions manually' :
                'Upload a document containing your questions'
              )}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="glow-base glow-action p-2 text-gray-400 hover:text-gray-500 rounded-lg bg-white"
          aria-label="Close editor"
        >
          <div className="flex items-center justify-center">
            <XMarkIcon className="h-6 w-6" />
          </div>
        </button>
      </div>

      {/* Initial View - Choose Method */}
      {!questionSetToEdit && view === 'initial' && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setView('manual')}
            className="glow-base glow-action flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-200 bg-white transition-all duration-200"
            tabIndex={0}
            autoFocus
          >
            <div className="flex flex-col items-center">
              <PencilSquareIcon className="h-8 w-8 mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Manual Entry</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Create categories and questions manually
              </p>
            </div>
          </button>

          <button
            onClick={() => setView('import')}
            className="glow-base glow-action flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-200 bg-white transition-all duration-200"
            tabIndex={0}
          >
            <div className="flex flex-col items-center">
              <ArrowUpTrayIcon className="h-8 w-8 mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Import Questions</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Import questions from a document or spreadsheet
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Manual Entry View */}
      {(view === 'manual' || questionSetToEdit) && (
        <div className="space-y-8">
          {/* Quick Guide - Only show for new sets */}
          {!questionSetToEdit && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-indigo-900">Quick Guide</h3>
                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">How to Create a Question Set</span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Create and Name Categories</p>
                    <p className="text-sm text-indigo-700 mt-0.5">Start by creating categories to organize your questions. Click the category name to edit it. Use the "Add Category" button to create more categories.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Add Questions to Each Category</p>
                    <p className="text-sm text-indigo-700 mt-0.5">Use the "New Question" button within each category to add questions. Type your question in the text field provided.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Add Model Instructions (Optional)</p>
                    <p className="text-sm text-indigo-700 mt-0.5">Click the (i) icon next to any question to add specific instructions for the AI model. These instructions help guide how the model should analyze and answer each question.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Save Your Question Set</p>
                    <p className="text-sm text-indigo-700 mt-0.5">Give your question set a name and description, then click "Save Question Set". Your set will be available for future use.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Set Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Set Details</h3>
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
                  placeholder="Enter a descriptive name for your question set"
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
                  placeholder="Describe the purpose of this question set"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Categories and Questions */}
          <div className="space-y-6">
            {editedSet.questions.project_questions.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={category.category}
                    onChange={(e) => {
                      const newQuestions = { ...editedSet.questions };
                      newQuestions.project_questions[categoryIndex].category = e.target.value;
                      setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                    }}
                    className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                    placeholder="Category Name"
                  />
                  <button
                    onClick={() => {
                      const newQuestions = { ...editedSet.questions };
                      newQuestions.project_questions.splice(categoryIndex, 1);
                      setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                    }}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Delete category"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {category.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="flex items-start gap-2">
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => {
                            const newQuestions = { ...editedSet.questions };
                            newQuestions.project_questions[categoryIndex].questions[questionIndex].text = e.target.value;
                            setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                          }}
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                          placeholder="Enter your question"
                        />
                        {showInstructionInput?.categoryIndex === categoryIndex && 
                         showInstructionInput?.questionIndex === questionIndex && (
                          <textarea
                            value={question.instruction}
                            onChange={(e) => {
                              const newQuestions = { ...editedSet.questions };
                              newQuestions.project_questions[categoryIndex].questions[questionIndex].instruction = e.target.value;
                              setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                            }}
                            className="mt-2 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            placeholder="Add instructions for the AI model..."
                            rows={3}
                          />
                        )}
                      </div>
                      <button
                        onClick={() => toggleInstructionInput(categoryIndex, questionIndex)}
                        className={`p-2 rounded-lg ${
                          showInstructionInput?.categoryIndex === categoryIndex && 
                          showInstructionInput?.questionIndex === questionIndex
                            ? 'text-indigo-600 bg-indigo-50'
                            : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                        aria-label="Toggle instruction input"
                      >
                        <InformationCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          const newQuestions = { ...editedSet.questions };
                          newQuestions.project_questions[categoryIndex].questions.splice(questionIndex, 1);
                          setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                        aria-label="Delete question"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddQuestion(categoryIndex)}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Question
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddCategory}
              className="w-full py-3 flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 border-2 border-dashed border-indigo-200 hover:border-indigo-300 rounded-xl"
            >
              <PlusIcon className="h-5 w-5" />
              Add Category
            </button>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSet}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <CheckIcon className="h-5 w-5" />
              {questionSetToEdit ? 'Save Changes' : 'Save Question Set'}
            </button>
          </div>
        </div>
      )}

      {/* Import View */}
      {view === 'import' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Questions</h3>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-600
                hover:file:bg-indigo-100"
            />
            <p className="mt-2 text-sm text-gray-500">
              Upload a CSV or Excel file containing your questions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}