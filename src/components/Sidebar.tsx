import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuestions } from '../store/questions';
import { useWindowSize } from '../hooks/useWindowSize';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const debug = (action: string, data?: any) => {
  console.log('[Sidebar]', action, data || '');
};

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const questions = useQuestions((state) => state.questions);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 1024;

  useEffect(() => {
    debug('Sidebar state change', { 
      open, 
      isMobile, 
      windowSize,
      questionCount: questions?.project_questions?.length 
    });
  }, [open, isMobile, windowSize, questions]);

  return (
    <>
      {/* Mobile sidebar */}
      {isMobile && (
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

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative w-full max-w-xs bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <SidebarContent questions={questions} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-lg">
          <SidebarContent questions={questions} />
        </div>
      )}
    </>
  );
}

function SidebarContent({ questions }: { questions: any }) {
  return (
    <nav className="flex flex-1 flex-col p-4">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        {questions.project_questions.map((category: any) => (
          <li key={category.category}>
            <div className="text-sm font-semibold leading-6 text-gray-900">
              {category.category}
            </div>
            <ul role="list" className="mt-2 space-y-2">
              {category.questions.map((question: any, idx: number) => (
                <li key={idx} className="text-sm leading-6 text-gray-600">
                  {typeof question === 'string' ? question : question.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}