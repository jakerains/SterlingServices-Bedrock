import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="py-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MainContent />
        </div>
      </main>

      <Footer />
    </div>
  );
}