import { create } from 'zustand';
import questionsData from '../../Questions.json';

interface Question {
  text: string;
  instruction?: string;
}

interface Category {
  category: string;
  questions: (Question | string)[];
}

interface QuestionsState {
  questions: {
    project_questions: Category[];
  };
  setQuestions: (questions: { project_questions: Category[] }) => void;
}

export const useQuestions = create<QuestionsState>((set) => ({
  questions: questionsData,
  setQuestions: (questions) => set({ questions }),
}));