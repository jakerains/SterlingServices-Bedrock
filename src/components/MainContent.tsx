import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useFileStore } from '../store/file';
import { useResults } from '../store/results';
import ResultsDisplay from './ResultsDisplay';
import StatusDisplay from './StatusDisplay';
import QuestionEditor from './QuestionEditor';

const debug = (action: string, data?: any) => {
  console.log('[MainContent]', action, data || '');
};

export default function MainContent() {
  const { setFile, file, processing } = useFileStore();
  const results = useResults((state) => state.results);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    debug('File dropped', { 
      files: acceptedFiles.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      }))
    });
    
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav'],
      'text/*': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
      ],
    },
  });

  return (
    <main className={`lg:pl-72 transition-all duration-300 ${file || results ? 'mt-16' : ''}`}>
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        {!file && !results && (
          <div className="mx-auto max-w-3xl space-y-8">
            <div
              {...getRootProps()}
              className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 p-12 text-center transition-all hover:border-indigo-500 hover:bg-gray-50"
            >
              <input {...getInputProps()} />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-purple-100/20 opacity-50" />
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-indigo-500" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                {isDragActive
                  ? "Drop the file here..."
                  : "Upload a file or drag and drop"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                MP3, WAV, TXT, PDF, or DOCX up to 10MB
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Quick Start Guide
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Follow these steps to generate your Statement of Work:
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2">
                <li className="flex gap-x-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">1</span>
                  Upload your audio or text file
                </li>
                <li className="flex gap-x-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">2</span>
                  Review and customize questions
                </li>
                <li className="flex gap-x-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">3</span>
                  Process your file
                </li>
                <li className="flex gap-x-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">4</span>
                  Download your SOW
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
    </main>
  );
}