import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import MainContent from './components/MainContent';
import useFileProcessing from './hooks/useFileProcessing';
import { 
  createBrowserRouter, 
  RouterProvider,
  createRoutesFromElements,
  Route
} from 'react-router-dom';

// Create the router configuration
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} />
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true
    }
  }
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize file processing hook
  useFileProcessing();

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Navbar setSidebarOpen={setSidebarOpen} />
      <MainContent />
    </div>
  );
}

// Export the RouterProvider component as default
export default function AppWrapper() {
  return (
    <RouterProvider router={router} />
  );
}