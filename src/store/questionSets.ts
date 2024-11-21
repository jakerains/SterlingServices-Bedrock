import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import sowQuestions from '../../Questions.json';

export interface Question {
  text: string;
  instruction?: string;
}

export interface Category {
  category: string;
  questions: (Question | string)[];
}

export interface QuestionSet {
  id: string;
  name: string;
  description: string;
  questions: {
    project_questions: Category[];
  };
}

interface QuestionSetsState {
  sets: QuestionSet[];
  activeSetId: string;
  addSet: (set: Omit<QuestionSet, 'id'>) => void;
  updateSet: (id: string, set: Partial<QuestionSet>) => void;
  deleteSet: (id: string) => void;
  setActiveSet: (id: string) => void;
  importSet: (file: File) => Promise<void>;
}

// Default SOW question set
const defaultSowSet: QuestionSet = {
  id: 'default',
  name: 'Default Analysis Set',
  description: 'Default question set for content analysis',
  questions: sowQuestions,
};

export const useQuestionSets = create<QuestionSetsState>()(
  persist(
    (set) => ({
      sets: [defaultSowSet],
      activeSetId: defaultSowSet.id,
      
      addSet: (newSet) => set((state) => ({
        sets: [...state.sets, { ...newSet, id: `set-${Date.now()}` }],
      })),
      
      updateSet: (id, updatedSet) => set((state) => ({
        sets: state.sets.map((set) =>
          set.id === id ? { ...set, ...updatedSet } : set
        ),
      })),
      
      deleteSet: (id) => set((state) => ({
        sets: state.sets.filter((set) => set.id !== id),
      })),
      
      setActiveSet: (id) => set({ activeSetId: id }),
      
      importSet: async (file) => {
        try {
          const text = await file.text();
          const importedSet = JSON.parse(text);
          set((state) => ({
            sets: [...state.sets, { ...importedSet, id: `set-${Date.now()}` }],
          }));
        } catch (error) {
          throw new Error('Failed to import question set');
        }
      },
    }),
    {
      name: 'question-sets-storage',
    }
  )
);