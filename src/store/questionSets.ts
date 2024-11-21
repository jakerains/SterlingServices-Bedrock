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
  id: 'sow-default',
  name: 'SOW Set',
  description: 'Default Statement of Work question set',
  questions: sowQuestions,
};

export const useQuestionSets = create<QuestionSetsState>()(
  persist(
    (set, get) => ({
      sets: [defaultSowSet],
      activeSetId: defaultSowSet.id,
      
      addSet: (newSet) => {
        const id = `set-${Date.now()}`;
        set((state) => ({
          sets: [...state.sets, { ...newSet, id }],
        }));
        return id;
      },

      updateSet: (id, updatedSet) => {
        set((state) => ({
          sets: state.sets.map((set) =>
            set.id === id ? { ...set, ...updatedSet } : set
          ),
        }));
      },

      deleteSet: (id) => {
        const { sets, activeSetId } = get();
        if (sets.length === 1) {
          throw new Error("Cannot delete the last question set");
        }
        
        set((state) => ({
          sets: state.sets.filter((set) => set.id !== id),
          activeSetId: activeSetId === id ? state.sets[0].id : activeSetId,
        }));
      },

      setActiveSet: (id) => {
        set({ activeSetId: id });
      },

      importSet: async (file: File) => {
        try {
          const content = await file.text();
          const questions = JSON.parse(content);
          const name = file.name.replace('.json', '');
          
          const newSet = {
            name,
            description: `Imported from ${file.name}`,
            questions,
          };
          
          const id = get().addSet(newSet);
          get().setActiveSet(id);
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