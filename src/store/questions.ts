import { create } from 'zustand';

interface Question {
  text: string;
  instructions?: string;
}

interface Category {
  category: string;
  questions: Question[];
}

interface QuestionsState {
  questions: {
    project_questions: Category[];
  };
}

const defaultQuestions = {
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

export const useQuestions = create<QuestionsState>(() => ({
  questions: defaultQuestions
}));