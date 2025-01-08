import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { Toaster } from 'react-hot-toast';
import { useQuestionSets } from './store/questionSets';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fetchSets = useQuestionSets((state) => state.fetchSets);

  useEffect(() => {
    fetchSets();
  }, [fetchSets]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MainContent />
        </div>
      </main>
    </div>
  );
}