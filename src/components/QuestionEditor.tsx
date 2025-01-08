import { useState } from 'react';
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

interface QuestionEditorProps {
  onClose: () => void;
}

type View = 'initial' | 'manual' | 'import';

export default function QuestionEditor({ onClose }: QuestionEditorProps) {
  const [view, setView] = useState<View>('initial');
  const { addSet } = useQuestionSets();
  const [showInstructionInput, setShowInstructionInput] = useState<{ categoryIndex: number; questionIndex: number } | null>(null);
  
  // State for manual entry
  const [editedSet, setEditedSet] = useState({
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
      await addSet(editedSet);
      toast.success('Question set created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create question set');
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
          {view !== 'initial' && (
            <button
              onClick={() => setView('initial')}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-lg"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {view === 'initial' && 'Create New Question Set'}
              {view === 'manual' && 'Create Question Set'}
              {view === 'import' && 'Import Questions'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {view === 'initial' && 'Choose how you want to create your new question set'}
              {view === 'manual' && 'Add categories and questions manually'}
              {view === 'import' && 'Upload a document containing your questions'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-500 rounded-lg"
          aria-label="Close editor"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Initial View - Choose Method */}
      {view === 'initial' && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setView('manual')}
            className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-200 hover:bg-gray-50 transition-all duration-200"
          >
            <PencilSquareIcon className="h-8 w-8 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Manual Entry</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Create categories and questions manually
            </p>
          </button>

          <button
            onClick={() => setView('import')}
            className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-200 hover:bg-gray-50 transition-all duration-200"
          >
            <ArrowUpTrayIcon className="h-8 w-8 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Import Questions</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Import questions from a document or spreadsheet
            </p>
          </button>
        </div>
      )}

      {/* Manual Entry View */}
      {view === 'manual' && (
        <div className="space-y-8">
          {/* Quick Guide */}
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
                  placeholder="Describe the purpose and scope of this question set"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Categories and Questions */}
          <div className="space-y-4">
            {editedSet.questions.project_questions.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={category.category}
                      onChange={(e) => {
                        const newQuestions = { ...editedSet.questions };
                        newQuestions.project_questions[categoryIndex].category = e.target.value;
                        setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                      }}
                      className="w-full text-lg font-medium bg-white border border-gray-200 hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-3 py-1.5 transition-colors duration-200"
                      placeholder="Enter category name..."
                    />
                    <PencilSquareIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddQuestion(categoryIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200 font-medium"
                      title="Add Question"
                    >
                      <PlusIcon className="h-4 w-4" />
                      New Question
                    </button>
                    <button
                      onClick={() => {
                        const newQuestions = { ...editedSet.questions };
                        newQuestions.project_questions.splice(categoryIndex, 1);
                        setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete Category"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {category.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <input
                              type="text"
                              value={question.text}
                              onChange={(e) => {
                                const newQuestions = { ...editedSet.questions };
                                newQuestions.project_questions[categoryIndex].questions[questionIndex].text = e.target.value;
                                setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                              }}
                              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter your question"
                            />
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleInstructionInput(categoryIndex, questionIndex)}
                                className={`p-1.5 rounded-lg transition-colors duration-200 ${
                                  question.instruction
                                    ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                                title={question.instruction ? "Edit Instructions" : "Add Model Instructions"}
                              >
                                <InformationCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => {
                                  const newQuestions = { ...editedSet.questions };
                                  newQuestions.project_questions[categoryIndex].questions.splice(questionIndex, 1);
                                  setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete Question"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          {/* Instructions Input */}
                          {showInstructionInput?.categoryIndex === categoryIndex && 
                           showInstructionInput?.questionIndex === questionIndex && (
                            <div className="mt-2 pl-2 border-l-2 border-indigo-200">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-indigo-600">Model Instructions</span>
                                  <span className="text-xs text-gray-500">(Guide how the AI should analyze this question)</span>
                                </div>
                                <button
                                  onClick={() => setShowInstructionInput(null)}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                                >
                                  <CheckIcon className="h-3 w-3" />
                                  Save
                                </button>
                              </div>
                              <textarea
                                value={question.instruction || ''}
                                onChange={(e) => {
                                  const newQuestions = { ...editedSet.questions };
                                  newQuestions.project_questions[categoryIndex].questions[questionIndex].instruction = e.target.value;
                                  setEditedSet(prev => ({ ...prev, questions: newQuestions }));
                                }}
                                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                placeholder="Example: List the response as bullet points, Include specific metrics, etc."
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center gap-x-1.5 px-4 py-2 rounded-lg bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              Add Category
            </button>

            <button
              onClick={handleSaveSet}
              className="inline-flex items-center px-6 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-sm transition-all duration-200"
            >
              Save Question Set
            </button>
          </div>
        </div>
      )}

      {/* Import View */}
      {view === 'import' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
            <div className="flex flex-col items-center">
              <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mb-4" />
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input 
                  type="file" 
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-600
                    hover:file:bg-indigo-100"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">
                Upload a text or Word document containing your questions
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported formats: .txt, .doc, .docx
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}