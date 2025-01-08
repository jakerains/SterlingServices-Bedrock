import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import QuestionSetCreator from './QuestionSetCreator';

interface QuestionSetsManagerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onEditClick: () => void;
}

export default function QuestionSetsManager({ open, setOpen, onEditClick }: QuestionSetsManagerProps) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {isCreating ? (
                  <QuestionSetCreator onClose={() => {
                    setIsCreating(false);
                    setOpen(false);
                  }} />
                ) : (
                  <div>
                    <div className="text-center">
                      <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                        Question Sets
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Manage your question sets for analysis
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <button
                        onClick={() => setIsCreating(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                      >
                        <span className="text-xl">+</span>
                        Create New Set
                      </button>

                      <button
                        onClick={() => {
                          onEditClick();
                          setOpen(false);
                        }}
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500 transition-colors"
                      >
                        Edit Current Set
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}