import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useFileStore } from '../store/file';
import { useResults } from '../store/results';
import ResultsDisplay from './ResultsDisplay';
import StatusDisplay from './StatusDisplay';
import QuestionEditor from './QuestionEditor';
import QuestionSetsManager from './QuestionSetsManager';
import { version } from '../../package.json';
import FileUpload from './FileUpload';

export default function MainContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { file, processing } = useFileStore();
  const results = useResults((state) => state.results);

  return (
    <main className="lg:pl-0 transition-all duration-300">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed top-20 left-4 z-40 p-2 rounded-md bg-white text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span className="sr-only">Open question sets</span>
        <Bars3Icon className="h-6 w-6" />
      </button>

      <QuestionSetsManager open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="px-4 py-10 sm:px-6 lg:px-8">
        {!file && !results && (
          <div className="mx-auto max-w-3xl space-y-8">
            <FileUpload />

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Quick Start Guide
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Follow these steps to analyze your content:
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2">
                <li className="flex gap-x-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">1</span>
                  Upload your audio or text file
                </li>
                <li className="flex gap-x-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">2</span>
                  Select or customize your question set
                </li>
                <li className="flex gap-x-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">3</span>
                  Process your content
                </li>
                <li className="flex gap-x-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">4</span>
                  Review your analysis
                </li>
              </ul>
            </div>
          </div>
        )}

        {file && !results && !processing && (
          <div className="mx-auto max-w-3xl space-y-6">
            <StatusDisplay />
            <QuestionEditor />
          </div>
        )}

        {file && !results && processing && (
          <div className="mx-auto max-w-3xl">
            <StatusDisplay />
          </div>
        )}

        {results && <ResultsDisplay />}
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
        v.{version}
      </div>
    </main>
  );
}