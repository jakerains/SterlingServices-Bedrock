import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useFileStore } from '../store/file';
import toast from 'react-hot-toast';

// Debug logger
const debug = (action: string, data?: any) => {
  console.log('[FileUpload]', action, data || '');
};

export default function FileUpload() {
  const { setFile } = useFileStore();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    debug('onDrop called', { 
      acceptedCount: acceptedFiles.length,
      rejectedCount: rejectedFiles.length,
      rejectedFiles: rejectedFiles.map(f => ({
        file: f.file.name,
        type: f.file.type,
        size: f.file.size,
        errors: f.errors.map(e => ({ code: e.code, message: e.message }))
      }))
    });
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      toast.error(error.message);
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      debug('File received', { 
        name: file.name, 
        type: file.type, 
        size: file.size 
      });

      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/x-m4a', 'audio/aac', 'application/octet-stream'];
      if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.mp3')) {
        debug('Invalid file type');
        toast.error('Please upload an MP3, WAV, M4A, or AAC file');
        return;
      }

      debug('Setting file in store');
      setFile(file);
      toast.success('File uploaded successfully');
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/mp3': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/x-wav': ['.wav'],
      'audio/x-m4a': ['.m4a'],
      'audio/aac': ['.aac'],
      'application/octet-stream': ['.mp3', '.wav', '.m4a', '.aac']
    },
    multiple: false,
    // Remove maxSize restriction as we'll handle large files in the upload process
  });

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
        MP3, WAV, M4A, or AAC files supported
      </p>
    </div>
  );
}