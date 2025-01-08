import { create } from 'zustand';

export interface Question {
  text: string;
  instruction?: string;
}

export interface Category {
  category: string;
  questions: Question[];
}

interface QuestionState {
  project_questions: Category[];
  setQuestions: (questions: Category[]) => void;
}

// Default questions from Questions.json
export const defaultQuestions: Category[] = [
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

export const useQuestionStore = create<QuestionState>((set) => ({
  project_questions: defaultQuestions,
  setQuestions: (questions) => set({ project_questions: questions }),
}));