import { create } from 'zustand';
import { getAllQuestionSets, addQuestionSet, deleteQuestionSet, updateQuestionSet } from '../api/questionSets';
import sowQuestions from '../../Questions.json';
import { toast } from 'react-hot-toast';

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
  addSet: (set: Omit<QuestionSet, 'id'>) => Promise<string>;
  updateSet: (id: string, set: Partial<QuestionSet>) => Promise<void>;
  deleteSet: (id: string) => Promise<void>;
  setActiveSet: (id: string) => void;
  importSet: (file: File) => Promise<void>;
  loadSets: () => Promise<void>;
  loading: boolean;
}

export const useQuestionSets = create<QuestionSetsState>((set, get) => ({
  sets: [],
  activeSetId: 'default',
  loading: false,
  
  loadSets: async () => {
    set({ loading: true });
    try {
      const sets = await getAllQuestionSets();
      set({ 
        sets, 
        activeSetId: sets.length > 0 ? sets[0].id : 'default',
        loading: false 
      });
    } catch (error) {
      console.error('Error loading question sets:', error);
      set({ loading: false });
    }
  },
  
  addSet: async (newSet) => {
    try {
      const id = await addQuestionSet(newSet);
      set((state) => ({
        sets: [...state.sets, { ...newSet, id }],
      }));
      return id;
    } catch (error) {
      toast.error('Failed to add question set');
      throw error;
    }
  },
  
  deleteSet: async (id) => {
    try {
      await deleteQuestionSet(id);
      set((state) => ({
        sets: state.sets.filter((set) => set.id !== id),
      }));
    } catch (error) {
      toast.error('Failed to delete question set');
      throw error;
    }
  },
  
  updateSet: async (id, updatedSet) => {
    try {
      await updateQuestionSet(id, updatedSet);
      set((state) => ({
        sets: state.sets.map((set) =>
          set.id === id ? { ...set, ...updatedSet } : set
        ),
      }));
    } catch (error) {
      toast.error('Failed to update question set');
      throw error;
    }
  },

  setActiveSet: (id) => {
    set({ activeSetId: id });
  },

  importSet: async (file) => {
    try {
      const text = await file.text();
      const importedSet = JSON.parse(text);
      const id = await addQuestionSet(importedSet);
      set((state) => ({
        sets: [...state.sets, { ...importedSet, id }],
      }));
      toast.success('Question set imported successfully');
    } catch (error) {
      toast.error('Failed to import question set');
      throw error;
    }
  },
}));