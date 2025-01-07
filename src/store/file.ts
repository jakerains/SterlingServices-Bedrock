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

const debug = (action: string, data: any) => {
  console.log('[FileStore]', action, data);
};

export const useFileStore = create<FileState>((set, get) => ({
  file: null,
  processing: false,
  completed: false,
  currentStep: 'upload',
  statusMessage: '',
  progress: 0,
  setFile: (file) => {
    debug('setFile', { fileName: file?.name, size: file?.size });
    set({ 
      file, 
      statusMessage: '', 
      progress: 0, 
      completed: false,
      processing: false,
      currentStep: 'upload'
    });
    debug('State after setFile', get());
  },
  setProcessing: (processing) => {
    debug('setProcessing', { processing, currentStep: get().currentStep });
    set({ processing });
  },
  setCurrentStep: (currentStep) => {
    debug('setCurrentStep', { currentStep, previousStep: get().currentStep });
    set({ currentStep, progress: 0 });
  },
  setStatusMessage: (statusMessage) => {
    debug('setStatusMessage', { statusMessage, currentStep: get().currentStep });
    set({ statusMessage });
  },
  setProgress: (progress) => {
    debug('setProgress', { progress, currentStep: get().currentStep });
    set({ progress });
  },
  setCompleted: (completed) => {
    debug('setCompleted', { completed, currentStep: get().currentStep });
    set({ completed });
  },
}));