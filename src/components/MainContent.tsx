import { useState } from 'react';
import FileUpload from './FileUpload';
import StatusDisplay from './StatusDisplay';
import ResultsDisplay from './ResultsDisplay';
import QuestionSetsManager from './QuestionSetsManager';
import QuestionEditor from './QuestionEditor';
import { useFileStore } from '../store/file';
import { useResults } from '../store/results';
import { useQuestions } from '../store/questions';
import useFileProcessing from '../hooks/useFileProcessing';
import { Bars3Icon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function MainContent() {
  useFileProcessing();
  const { file, processing } = useFileStore();
  const { results } = useResults();
  const [isEditing, setIsEditing] = useState(false);
  const [isManagingQuestions, setIsManagingQuestions] = useState(false);
  const questions = useQuestions((state) => state.questions);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Menu Button */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setIsManagingQuestions(true)}
          className="inline-flex items-center gap-2 p-2 text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
          aria-label="Open question sets"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-8">
        {/* Status Display */}
        {(file && !results) && <StatusDisplay />}

        {/* Results Display */}
        {results && <ResultsDisplay />}

        {/* Question Editor */}
        {isEditing && (
          <QuestionEditor onClose={() => setIsEditing(false)} />
        )}

        {/* Question Sets Manager */}
        <QuestionSetsManager
          open={isManagingQuestions}
          setOpen={setIsManagingQuestions}
          onEditClick={() => setIsEditing(true)}
        />

        {/* File Upload Area */}
        {!file && !results && !isEditing && (
          <div className="mx-auto max-w-3xl space-y-8">
            <FileUpload />
            
            {/* Current Question Set */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <ClipboardDocumentIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase">
                      CURRENT QUESTION SET
                    </h3>
                    <p className="text-lg font-semibold text-indigo-600 mt-1">
                      Default Analysis Set
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsManagingQuestions(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Change Set
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {questions.project_questions.reduce((total, category) => total + category.questions.length, 0)} questions across {questions.project_questions.length} categories
              </p>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
              <p className="text-sm text-gray-600 mb-6">
                Follow these steps to analyze your content:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                    1
                  </div>
                  <p className="text-sm text-gray-600">Select or customize your question set</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                    2
                  </div>
                  <p className="text-sm text-gray-600">Upload your audio or text file</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                    3
                  </div>
                  <p className="text-sm text-gray-600">Review the analysis results</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                    4
                  </div>
                  <p className="text-sm text-gray-600">Download or share your report</p>
                </div>
              </div>
            </div>

            {/* Version Number */}
            <div className="text-center mt-8 text-sm text-gray-500">
              v.0.3.3
            </div>
          </div>
        )}
      </div>
    </div>
  );
}