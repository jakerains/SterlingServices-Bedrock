import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useFileStore } from '../store/file';
import { useResults } from '../store/results';
import toast from 'react-hot-toast';

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const SUPPORTED_AUDIO_FORMATS = {
  'audio/mpeg': ['.mp3'],
  'audio/mp3': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/x-wav': ['.wav'],
  'audio/m4a': ['.m4a'],
  'audio/x-m4a': ['.m4a'],
  'audio/x-mp3': ['.mp3'],
  'audio/aac': ['.aac'],
};

export default function FileUpload() {
  const { setFile, completed, reset } = useFileStore();
  const { setResults } = useResults();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 100MB');
        return;
      }
      
      console.log('File type:', file.type); // Debug log
      setFile(file);
      toast.success('File uploaded successfully');
    }
  }, [setFile]);

  const handleNewTranscription = useCallback(() => {
    reset();
    setResults(null);
  }, [reset, setResults]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      ...SUPPORTED_AUDIO_FORMATS,
      'text/*': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: MAX_FILE_SIZE,
  });

  if (completed) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <button
          onClick={handleNewTranscription}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          New Transcription
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className="mx-auto max-w-3xl rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <input {...getInputProps()} />
      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {isDragActive ? "Drop the file here..." : "Upload a file or drag and drop"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        MP3, WAV, M4A, TXT, PDF, or DOCX up to 100MB
      </p>
    </div>
  );
}