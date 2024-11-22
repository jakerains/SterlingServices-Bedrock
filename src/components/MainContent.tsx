import { useState, useEffect } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useFileStore } from '../store/file';
import { useResults } from '../store/results';
import ResultsDisplay from './ResultsDisplay';
import StatusDisplay from './StatusDisplay';
import QuestionEditor from './QuestionEditor';
import QuestionSetsManager from './QuestionSetsManager';
import { version } from '../../package.json';
import FileUpload from './FileUpload';
import { useQuestionSets } from '../store/questionSets';
import ProcessingStatus from './ProcessingStatus';
import { Link } from 'react-router-dom';

export default function MainContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { file, processing } = useFileStore();
  const results = useResults((state) => state.results);
  const { sets, activeSetId, loadSets } = useQuestionSets();
  
  useEffect(() => {
    loadSets();
  }, [loadSets]);

  const activeSet = sets.find(set => set.id === activeSetId);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow pb-16">
        <main className="lg:pl-0 transition-all duration-300">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="fixed top-20 left-4 z-40 p-2 rounded-md bg-white text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span className="sr-only">Open question sets</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          <QuestionSetsManager open={sidebarOpen} setOpen={setSidebarOpen} onEditClick={() => setIsEditing(true)} />

          <div className="px-4 py-10 sm:px-6 lg:px-8">
            {isEditing && (
              <QuestionEditor onClose={() => setIsEditing(false)} />
            )}
            
            {!file && !results && !isEditing && (
              <div className="mx-auto max-w-3xl space-y-4">
                <FileUpload />
                
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-md">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 mb-4">
                      <svg 
                        className="w-6 h-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Current Question Set
                    </h3>
                    <p className="mt-2 text-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                      {activeSet?.name}
                    </p>
                    {activeSet?.description && (
                      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                        {activeSet.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 max-w-2xl mx-auto">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Quick Start Guide
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Follow these steps to analyze your content:
                  </p>
                  <ul className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2">
                    <li className="flex gap-x-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium">1</span>
                      Select or customize your question set
                    </li>
                    <li className="flex gap-x-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium">2</span>
                      Upload your audio or text file
                    </li>
                    <li className="flex gap-x-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium">3</span>
                      Review the analysis results
                    </li>
                    <li className="flex gap-x-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium">4</span>
                      Download or share your report
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {file && !results && <StatusDisplay />}
            {results && <ResultsDisplay />}
          </div>
        </main>
      </div>
      
      <footer className="w-full py-4 text-center text-gray-600 text-sm mt-auto">
        <p>v{version}</p>
      </footer>
    </div>
  );
}