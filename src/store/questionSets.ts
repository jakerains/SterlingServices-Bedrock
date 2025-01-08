import { create } from 'zustand';
import { Category } from './questions';
import { QuestionSet } from '../services/questionSets';
import * as QuestionSetService from '../services/questionSets';
import { toast } from 'react-hot-toast';

export interface QuestionSet {
  id: string;
  name: string;
  description: string;
  questions: {
    project_questions: Category[];
  };
  isDefault?: boolean;
}

interface QuestionSetsState {
  sets: QuestionSet[];
  activeSetId: string;
  loading: boolean;
  setActiveSet: (id: string) => void;
  addSet: (set: Omit<QuestionSet, 'id' | 'created_at'>) => Promise<void>;
  updateSet: (id: string, updates: Partial<QuestionSet>) => Promise<void>;
  deleteSet: (id: string) => Promise<void>;
  fetchSets: () => Promise<void>;
}

// Statement of Work template
export const sowQuestions: Category[] = [
  {
    category: "Project Overview",
    questions: [
      {
        text: "What is the primary objective of the project?",
        instruction: ""
      },
      {
        text: "What are the key deliverables?",
        instruction: "Give me this as a bulleted list with sub items broken out."
      },
      {
        text: "What are the success criteria for the project?",
        instruction: ""
      }
    ]
  },
  {
    category: "Scope of Work",
    questions: [
      { text: "What tasks need to be completed?", instruction: "" },
      { text: "What are the specific requirements and constraints?", instruction: "" },
      { text: "Are there any assumptions or exclusions?", instruction: "" }
    ]
  },
  {
    category: "Project Deliverables",
    questions: [
      { text: "What are the specific deliverables and their descriptions?", instruction: "" },
      { text: "What are the deadlines for each deliverable?", instruction: "" },
      { text: "What are the acceptance criteria for each deliverable?", instruction: "" }
    ]
  },
  {
    category: "Timeline and Milestones",
    questions: [
      { text: "What is the project start date?", instruction: "" },
      { text: "What is the project end date?", instruction: "" },
      { text: "What are the major milestones and their deadlines?", instruction: "" }
    ]
  },
  {
    category: "Roles and Responsibilities",
    questions: [
      { text: "Who are the key stakeholders?", instruction: "" },
      { text: "What are the roles and responsibilities of each team member?", instruction: "" },
      { text: "Are there any third-party vendors or partners involved?", instruction: "" }
    ]
  },
  {
    category: "Budget and Payment Terms",
    questions: [
      { text: "What is the total budget for the project?", instruction: "" },
      { text: "How will payments be structured (e.g., fixed Fee price, Fixed Fee Milestones, or time and materials)?", instruction: "" },
      { text: "What are the payment milestones?", instruction: "" }
    ]
  },
  {
    category: "Project Management and Reporting",
    questions: [
      { text: "What project management methodology will be used?", instruction: "" },
      { text: "How will progress be tracked and reported?", instruction: "" },
      { text: "What tools and software will be used for project management and communication?", instruction: "" }
    ]
  },
  {
    category: "Risk Management",
    questions: [
      { text: "What are the potential risks and their mitigation strategies?", instruction: "" },
      { text: "Who is responsible for managing risks?", instruction: "" }
    ]
  },
  {
    category: "Legal and Compliance",
    questions: [
      { text: "Are there any legal or regulatory requirements that need to be addressed?", instruction: "" },
      { text: "What are the confidentiality and non-disclosure requirements?", instruction: "" }
    ]
  },
  {
    category: "Post-Project Support",
    questions: [
      { text: "Will there be any post-project support or maintenance required?", instruction: "" },
      { text: "What are the terms for post-project support?", instruction: "" }
    ]
  },
  {
    category: "Dependencies and Constraints",
    questions: [
      { text: "Are there any dependencies on other projects or external factors?", instruction: "" },
      { text: "What constraints could impact the project?", instruction: "" }
    ]
  }
];

// Past Performance template
export const pastPerformanceQuestions: Category[] = [
  {
    category: "Contract Details",
    questions: [
      { text: "What was the Name and Project ID of this project?", instruction: "" },
      { text: "Was Sterling the prime contractor or a subcontractor?", instruction: "" },
      { text: "Who was the 'contractual point of contact' from the client?", instruction: "" },
      { text: "Who was the 'technical contact' from the client?", instruction: "" },
      { text: "Was this a new contract or extension/renewal contract?", instruction: "" },
      { text: "What was the start and end date of the contract?", instruction: "" },
      { 
        text: "Was this contract Services-only or did it include hardware?",
        instruction: "If it included hardware, please provide a summary of what HW was included."
      },
      { text: "Name each Sterling person (with their title/role) involved with this project", instruction: "" },
      { text: "If partners were used, please name each person (with their title/role) involved with this project.", instruction: "" }
    ]
  },
  {
    category: "Description of Services",
    questions: [
      {
        text: "What type of Sterling Services were included?",
        instruction: "List options: Client Services, Warehousing/Shipping, Enterprise Professional Services, Managed Services, Combination"
      },
      { text: "Provide a summary of the requested services from the Client?", instruction: "" },
      { text: "What technology/solutions were sought by client?", instruction: "" },
      { text: "What capabilities/specialized knowledge did Sterling perform?", instruction: "" },
      { text: "What work/services did client need performed and why?", instruction: "" },
      { text: "What IT challenges/problems/issues/'pain points' was Sterling hired to address/resolve/fix?", instruction: "" },
      {
        text: "Describe the process of the work",
        instruction: "Include details like project phases, chronology, and regular activities (daily/weekly/monthly)."
      },
      {
        text: "What specific technologies did Sterling use to perform the work?",
        instruction: "Provide details of hardware (including brand names) and software (including brand names)."
      }
    ]
  },
  {
    category: "Outcome of Project",
    questions: [
      { text: "Describe the goal or successful outcome for the client?", instruction: "" },
      { text: "Describe the list of deliverables provided during the project?", instruction: "" },
      { text: "Were there any additional benefits to the client/successes beyond the required work?", instruction: "" },
      { text: "Provide client's response to or evaluation of Sterling's performance?", instruction: "" }
    ]
  },
  {
    category: "Lessons Learned",
    questions: [
      { text: "What lessons were learned in doing this project?", instruction: "" },
      { text: "What improvements can be made for successful future projects?", instruction: "" },
      { text: "Is there anything else we should record about the project?", instruction: "" }
    ]
  }
];

// Default question sets
const defaultSets: QuestionSet[] = [
  {
    id: 'sow',
    name: 'Statement of Work',
    description: 'Standard set of questions for creating a Statement of Work',
    questions: { project_questions: sowQuestions },
    isDefault: true
  },
  {
    id: 'past-performance',
    name: 'Past Performance',
    description: 'Standard set of questions for analyzing past project performance',
    questions: { project_questions: pastPerformanceQuestions },
    isDefault: true
  }
];

export const useQuestionSets = create<QuestionSetsState>((set) => ({
  sets: defaultSets,
  activeSetId: 'sow',
  loading: false,

  setActiveSet: (id) => set({ activeSetId: id }),

  fetchSets: async () => {
    set({ loading: true });
    try {
      const cloudSets = await QuestionSetService.fetchQuestionSets();
      set((state) => ({
        sets: [...defaultSets, ...cloudSets.filter(s => !s.isDefault)]
      }));
    } catch (error) {
      console.error('Error fetching question sets:', error);
      toast.error('Failed to fetch question sets');
    } finally {
      set({ loading: false });
    }
  },

  addSet: async (newSet) => {
    set({ loading: true });
    try {
      const createdSet = await QuestionSetService.createQuestionSet(newSet);
      set((state) => ({
        sets: [...state.sets, createdSet]
      }));
      toast.success('Question set created successfully');
    } catch (error) {
      console.error('Error creating question set:', error);
      toast.error('Failed to create question set');
    } finally {
      set({ loading: false });
    }
  },

  updateSet: async (id, updates) => {
    set({ loading: true });
    try {
      const updatedSet = await QuestionSetService.updateQuestionSet(id, updates);
      set((state) => ({
        sets: state.sets.map((set) =>
          set.id === id && !set.isDefault ? updatedSet : set
        )
      }));
      toast.success('Question set updated successfully');
    } catch (error) {
      console.error('Error updating question set:', error);
      toast.error('Failed to update question set');
    } finally {
      set({ loading: false });
    }
  },

  deleteSet: async (id) => {
    set({ loading: true });
    try {
      await QuestionSetService.deleteQuestionSet(id);
      set((state) => ({
        sets: state.sets.filter((set) => set.id !== id || set.isDefault),
        activeSetId: state.activeSetId === id ? 'sow' : state.activeSetId
      }));
      toast.success('Question set deleted successfully');
    } catch (error) {
      console.error('Error deleting question set:', error);
      toast.error('Failed to delete question set');
    } finally {
      set({ loading: false });
    }
  }
}));