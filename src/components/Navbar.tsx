import { Bars3Icon } from '@heroicons/react/24/outline';
import { useWindowSize } from '../hooks/useWindowSize';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 1024; // Tailwind's lg breakpoint

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {isMobile && (
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              Sterling Services: S.O.W. Generator
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}