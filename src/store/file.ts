import { create } from 'zustand';

interface FileState {
  file: File | null;
  processing: boolean;
  completed: boolean;
  currentStep: 'upload' | 'transcribe' | 'analyze' | 'generate';
  statusMessage: string;
  progress: number;
  setFile: (file: File) => void;
  setProcessing: (processing: boolean) => void;
  setCurrentStep: (step: 'upload' | 'transcribe' | 'analyze' | 'generate') => void;
  setStatusMessage: (message: string) => void;
  setProgress: (progress: number) => void;
  setCompleted: (completed: boolean) => void;
}

const debug = (action: string, state: any) => {
  console.log('[FileStore]', action, state);
};

export const useFileStore = create<FileState>((set) => ({
  file: null,
  processing: false,
  completed: false,
  currentStep: 'upload',
  statusMessage: '',
  progress: 0,
  setFile: (file) => {
    debug('setFile', { fileName: file?.name });
    set({ file, statusMessage: '', progress: 0, completed: false });
  },
  setProcessing: (processing) => {
    debug('setProcessing', { processing });
    set({ processing });
  },
  setCurrentStep: (currentStep) => {
    debug('setCurrentStep', { currentStep });
    set({ currentStep, progress: 0 });
  },
  setStatusMessage: (statusMessage) => {
    debug('setStatusMessage', { statusMessage });
    set({ statusMessage });
  },
  setProgress: (progress) => {
    debug('setProgress', { progress });
    set({ progress });
  },
  setCompleted: (completed) => {
    debug('setCompleted', { completed });
    set({ completed });
  },
}));