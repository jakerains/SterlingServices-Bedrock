import { useState } from 'react';
import FileUpload from './FileUpload';
import StatusDisplay from './StatusDisplay';
import ResultsDisplay from './ResultsDisplay';
import QuestionEditor from './QuestionEditor';
import { useFileStore } from '../store/file';
import { useResults } from '../store/results';
import { useQuestionSets } from '../store/questionSets';
import useFileProcessing from '../hooks/useFileProcessing';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function MainContent() {
  useFileProcessing();
  const { file } = useFileStore();
  const { results } = useResults();
  const [isEditing, setIsEditing] = useState(false);
  const { sets, activeSetId } = useQuestionSets();
  const activeSet = sets.find(set => set.id === activeSetId)!;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8">
          {/* Status Display */}
          {(file && !results) && <StatusDisplay />}

          {/* Results Display */}
          {results && <ResultsDisplay />}

          {/* Question Editor */}
          {isEditing && (
            <QuestionEditor onClose={() => setIsEditing(false)} />
          )}

          {/* File Upload Area with Enhanced UI */}
          {!file && !results && !isEditing && (
            <div className="mx-auto max-w-5xl">
              {/* Quick Guide */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-semibold text-indigo-900">Quick Guide</h2>
                  <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">How it works</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-900">Select Your Question Set</p>
                      <p className="text-sm text-indigo-700 mt-0.5">Choose from predefined sets or create your own custom question set using the menu.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-900">Upload Your Recording</p>
                      <p className="text-sm text-indigo-700 mt-0.5">Upload an audio file of your meeting or conversation for analysis.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-900">Automated Processing</p>
                      <p className="text-sm text-indigo-700 mt-0.5">Watch as your audio is transcribed and analyzed in real-time.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                      4
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-900">Review Results</p>
                      <p className="text-sm text-indigo-700 mt-0.5">Get comprehensive answers to your questions and download the results in your preferred format.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload Component */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <FileUpload />
              </div>

              {/* Active Question Set Info */}
              <div className="mt-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-xl">
                    <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {activeSet.name}
                      </h2>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                          {activeSet.questions.project_questions.reduce((total, category) => total + category.questions.length, 0)} Questions
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {activeSet.questions.project_questions.length} Categories
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {activeSet.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeSet.questions.project_questions.map((category, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
                        >
                          {category.category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}