import { useState, useRef } from 'react';
import { useQuestionSets } from '../store/questionSets';
import {
  PlusIcon,
  DocumentArrowUpIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function QuestionSetsManager() {
  const {
    sets,
    activeSetId,
    setActiveSet,
    addSet,
    deleteSet,
    importSet,
  } = useQuestionSets();
  const [isCreating, setIsCreating] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateSet = () => {
    if (!newSetName.trim()) {
      toast.error('Please enter a name for the question set');
      return;
    }

    try {
      addSet({
        name: newSetName,
        description: newSetDescription,
        questions: {
          project_questions: [],
        },
      });
      setIsCreating(false);
      setNewSetName('');
      setNewSetDescription('');
      toast.success('Question set created successfully');
    } catch (error) {
      toast.error('Failed to create question set');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importSet(file);
      toast.success('Question set imported successfully');
    } catch (error) {
      toast.error('Failed to import question set');
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteSet(id);
      toast.success('Question set deleted successfully');
    } catch (error) {
      toast.error('Cannot delete the last question set');
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Question Sets
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
          >
            <DocumentArrowUpIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Import Set
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleImport}
          />
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            New Set
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="mb-6 space-y-4 border-b border-gray-200 pb-6">
          <div>
            <label htmlFor="newSetName" className="block text-sm font-medium text-gray-700">
              Set Name
            </label>
            <input
              type="text"
              id="newSetName"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="newSetDescription" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="newSetDescription"
              value={newSetDescription}
              onChange={(e) => setNewSetDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCreating(false)}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSet}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sets.map((set) => (
          <div
            key={set.id}
            className={`flex items-center justify-between rounded-lg border p-4 ${
              set.id === activeSetId ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
            }`}
          >
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{set.name}</h3>
              {set.description && (
                <p className="mt-1 text-sm text-gray-500">{set.description}</p>
              )}
            </div>
            <div className="ml-4 flex items-center gap-2">
              <button
                onClick={() => setActiveSet(set.id)}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  set.id === activeSetId
                    ? 'text-indigo-600'
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                {set.id === activeSetId ? 'Active' : 'Use'}
              </button>
              {sets.length > 1 && (
                <button
                  onClick={() => handleDelete(set.id)}
                  className="text-red-600 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}