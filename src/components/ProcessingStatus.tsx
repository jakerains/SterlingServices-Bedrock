import { useFileStore } from '../store/file';

export default function ProcessingStatus() {
  const { file, processing } = useFileStore();

  if (!file) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Processing File</h2>
        <p className="mt-1 text-sm text-gray-500">{file.name}</p>
        {processing && (
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div 
                className="h-2 rounded-full bg-indigo-600 transition-all duration-500" 
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}