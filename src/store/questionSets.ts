import { create } from 'zustand';
import { getAllQuestionSets, addQuestionSet, deleteQuestionSet, updateQuestionSet } from '../api/questionSets';
import { toast } from 'react-hot-toast';

export const defaultQuestions = {
  project_questions: [
    {
      category: "Meeting Overview",
      questions: [
        { text: "What is the main purpose or objective of this meeting?" },
        { text: "Who are the key participants in the meeting?" },
        { text: "What are the main topics or agenda items discussed?" }
      ]
    },
    {
      category: "Key Decisions",
      questions: [
        { text: "What major decisions were made during the meeting?" },
        { text: "What are the agreed-upon next steps or action items?" },
        { text: "Are there any deadlines or timelines mentioned?" }
      ]
    },
    {
      category: "Action Items",
      questions: [
        { text: "What specific tasks or assignments were delegated?" },
        { text: "Who is responsible for each action item?" },
        { text: "What are the follow-up requirements discussed?" }
      ]
    },
    {
      category: "Discussion Points",
      questions: [
        { text: "What are the main challenges or concerns raised?" },
        { text: "What solutions or alternatives were proposed?" },
        { text: "Were there any unresolved issues or points requiring further discussion?" }
      ]
    }
  ]
};

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
      const defaultSet = {
        id: 'default',
        name: 'Default Analysis Set',
        description: 'Standard set of questions for analyzing meeting content',
        questions: defaultQuestions,
        created_at: new Date(0)
      };
      
      set({ 
        sets: [defaultSet, ...sets.filter(s => s.id !== 'default')],
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