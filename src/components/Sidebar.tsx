import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';
import { useQuestions } from '../store/questions';
import { useWindowSize } from '../hooks/useWindowSize';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const questions = useQuestions((state) => state.questions);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 1024;

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
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Question Sets</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <SidebarContent questions={questions} />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
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