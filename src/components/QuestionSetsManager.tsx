import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useQuestionSets } from '../store/questionSets';
import toast from 'react-hot-toast';

interface QuestionSetsManagerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onEditClick: () => void;
}

export default function QuestionSetsManager({ open, setOpen, onEditClick }: QuestionSetsManagerProps) {
  const { sets, activeSetId, setActiveSet, addSet, updateSet, deleteSet } = useQuestionSets();
  const [isCreating, setIsCreating] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');

  const handleSetClick = (setId: string) => {
    const selectedSet = sets.find(set => set.id === setId);
    if (selectedSet) {
      setActiveSet(setId);
      toast.success(`Selected question set: ${selectedSet.name}`);
      setOpen(false);
    }
  };

  const handleCreateSet = async () => {
    if (!newSetName.trim()) {
      toast.error('Please enter a name for the set');
      return;
    }

    try {
      await addSet({
        name: newSetName,
        description: newSetDescription,
        questions: {
          project_questions: [
            {
              category: 'New Category',
              questions: ['New Question']
            }
          ]
        }
      });

      setNewSetName('');
      setNewSetDescription('');
      setIsCreating(false);
      toast.success('Question set created');
    } catch (error) {
      toast.error('Failed to create question set');
      console.error('Create error:', error);
    }
  };

  const handleDeleteSet = (setId: string, setName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent set selection when clicking delete
    
    if (setId === 'default') {
      toast.error("Cannot delete the default set");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete "${setName}"?`)) {
      deleteSet(setId);
      if (activeSetId === setId) {
        setActiveSet('default');
      }
      toast.success(`Deleted question set: ${setName}`);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-center justify-between p-4 border-b">
                      <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                        Question Sets
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500"
                        onClick={() => setOpen(false)}
                        aria-label="Close question sets panel"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="px-4 sm:px-6">
                    <button
                      onClick={() => setIsCreating(true)}
                      className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Create New Set
                    </button>

                    {isCreating && (
                      <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          placeholder="Set Name"
                          value={newSetName}
                          onChange={(e) => setNewSetName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <textarea
                          placeholder="Description"
                          value={newSetDescription}
                          onChange={(e) => setNewSetDescription(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleCreateSet}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-500"
                          >
                            Create
                          </button>
                          <button
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 space-y-4 px-4 sm:px-6">
                      <div
                        className={`relative p-4 rounded-lg border cursor-pointer ${
                          'default' === activeSetId
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-purple-200 bg-purple-50'
                        }`}
                        onClick={() => handleSetClick('default')}
                      >
                        <div className="pr-20">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">Default Analysis Set</h3>
                            <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                              Default Template
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Standard set of questions for analyzing meeting content
                          </p>
                          <p className="mt-2 text-sm text-purple-600">
                            This is the default template with standard meeting analysis questions. You can use it as a starting point for your own sets.
                          </p>
                        </div>
                        
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSet('default');
                              onEditClick();
                              setOpen(false);
                            }}
                            className="p-1.5 text-purple-400 hover:text-purple-600 rounded-full hover:bg-purple-50"
                            title="View Template"
                            aria-label="View default template"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {sets.filter(set => set.id !== 'default').map((set) => (
                        <div
                          key={set.id}
                          className={`relative p-4 rounded-lg border cursor-pointer ${
                            set.id === activeSetId
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                          onClick={() => handleSetClick(set.id)}
                        >
                          <div className="pr-20">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">{set.name}</h3>
                            </div>
                            {set.description && (
                              <p className="mt-1 text-sm text-gray-500">
                                {set.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSet(set.id);
                                onEditClick();
                                setOpen(false);
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                              title="Edit Set"
                              aria-label={`Edit ${set.name}`}
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            
                            <button
                              onClick={(e) => handleDeleteSet(set.id, set.name, e)}
                              className="p-1.5 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50"
                              title="Delete Set"
                              aria-label={`Delete ${set.name}`}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}