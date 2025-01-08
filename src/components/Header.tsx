import { Bars3Icon } from '@heroicons/react/24/outline';
import sterlingLogo from '../assets/sterling.png';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 p-2 rounded-md"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-4 flex items-center">
              <img
                className="h-8"
                src={sterlingLogo}
                alt="Sterling"
              />
              <div className="ml-3 pl-3 border-l border-gray-200">
                <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Services Toolkit
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 