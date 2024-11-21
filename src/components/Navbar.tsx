import Image from 'next/image';
import { useWindowSize } from '../hooks/useWindowSize';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 1024;

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-end gap-3">
            <Image
              src="/images/sterling.png"
              alt="Sterling Logo"
              width={240}
              height={80}
              className="h-8 w-auto object-contain"
              priority
              unoptimized
            />
            <span className="text-2xl font-semibold text-gray-900 pb-[4px]">
              Services: ToolKit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}