import { useQuestionSets } from '../store/questionSets';
import { 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  PlusIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import QuestionEditor from './QuestionEditor';
import QuestionSetViewer from './QuestionSetViewer';
import './ResultsDisplay.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { sets, activeSetId, setActiveSet } = useQuestionSets();
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [viewingSetId, setViewingSetId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const viewingSet = viewingSetId ? sets.find(s => s.id === viewingSetId) : null;

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-96 max-w-xs flex-1 flex-col bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-4">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex-1 overflow-y-auto">
                  <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">Question Sets</h2>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsCreatingNew(true);
                        }}
                        className="glow-base glow-action inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white rounded-lg transition-colors duration-200"
                        title="Add new set"
                      >
                        <div className="flex items-center gap-1.5">
                          <PlusIcon className="h-5 w-5" />
                          <span>New Set</span>
                        </div>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">Select a set to use or click the eye icon to preview</p>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-4">
                      {sets.map((set) => (
                        <div 
                          key={set.id} 
                          className={`relative group rounded-lg border transition-all duration-200 ${
                            activeSetId === set.id
                              ? 'border-indigo-200 bg-indigo-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <button
                            onClick={() => {
                              setActiveSet(set.id);
                              onClose();
                            }}
                            className={`glow-base ${
                              activeSetId === set.id ? 'glow-indigo' : 'glow-gray'
                            } w-full p-4 text-left rounded-lg bg-white`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 ${
                                activeSetId === set.id ? 'text-indigo-600' : 'text-gray-500'
                              }`}>
                                {set.id === 'sow' ? (
                                  <DocumentTextIcon className="h-6 w-6" />
                                ) : (
                                  <ClipboardDocumentCheckIcon className="h-6 w-6" />
                                )}
                              </div>
                              <div>
                                <h3 className={`font-medium ${
                                  activeSetId === set.id ? 'text-indigo-900' : 'text-gray-900'
                                }`}>
                                  {set.name}
                                </h3>
                                <p className={`text-sm mt-1 ${
                                  activeSetId === set.id ? 'text-indigo-600' : 'text-gray-500'
                                }`}>
                                  {set.description}
                                </p>
                              </div>
                            </div>
                          </button>
                          <div className="absolute right-3 top-3 flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingSetId(set.id);
                              }}
                              className={`glow-base glow-action p-1.5 rounded-lg transition-colors duration-200 bg-white ${
                                activeSetId === set.id
                                  ? 'text-indigo-600 hover:bg-indigo-100'
                                  : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                              }`}
                              title="View set"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            {!set.isDefault && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSetId(set.id);
                                }}
                                className={`glow-base glow-action p-1.5 rounded-lg transition-colors duration-200 bg-white ${
                                  activeSetId === set.id
                                    ? 'text-indigo-600 hover:bg-indigo-100'
                                    : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                                title="Edit set"
                              >
                                <PencilSquareIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Question Editor Modal */}
      {(editingSetId || isCreatingNew) && (
        <Transition.Root show={true} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => {
            setEditingSetId(null);
            setIsCreatingNew(false);
          }} initialFocus={undefined}>
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

            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel 
                    className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
                    tabIndex={-1}
                  >
                    <QuestionEditor 
                      onClose={() => {
                        setEditingSetId(null);
                        setIsCreatingNew(false);
                      }}
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}

      {/* Question Set Viewer Modal */}
      {viewingSet && (
        <QuestionSetViewer
          set={viewingSet}
          onClose={() => setViewingSetId(null)}
        />
      )}
    </>
  );
}