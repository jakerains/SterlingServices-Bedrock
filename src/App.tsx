import { Toaster } from 'react-hot-toast';
import MainContent from './components/MainContent';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />
      <main className="py-10">
        <MainContent />
      </main>
    </div>
  );
}