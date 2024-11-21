import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useQuestionSets } from '../store/questionSets';
import toast from 'react-hot-toast';

interface QuestionSetsManagerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function QuestionSetsManager({ open, setOpen }: QuestionSetsManagerProps) {
  const { sets, activeSetId, setActiveSet } = useQuestionSets();
  const [isCreating, setIsCreating] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSetClick = (setId: string) => {
    setActiveSet(setId);
    setIsEditing(true);
    setOpen(false); // Close the sidebar after selection
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
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="space-y-4">
                      {sets.map((set) => (
                        <button
                          key={set.id}
                          onClick={() => handleSetClick(set.id)}
                          className={`w-full text-left p-4 rounded-lg border ${
                            set.id === activeSetId
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                          }`}
                        >
                          <h3 className="font-medium text-gray-900">{set.name}</h3>
                          {set.description && (
                            <p className="mt-1 text-sm text-gray-500">
                              {set.description}
                            </p>
                          )}
                        </button>
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