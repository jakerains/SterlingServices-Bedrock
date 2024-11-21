import { create } from 'zustand';

interface Answer {
  question: string;
  answer: string;
}

interface CategoryResult {
  category: string;
  answers: Answer[];
}

interface ResultsState {
  results: CategoryResult[] | null;
  setResults: (results: CategoryResult[]) => void;
}

export const useResults = create<ResultsState>((set) => ({
  results: null,
  setResults: (results) => set({ results }),
}));