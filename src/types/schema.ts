export type Schema = {
  models: {
    QuestionSet: {
      id: string;
      name: string;
      description: string;
      questions: {
        project_questions: Array<{
          category: string;
          questions: Array<{
            text: string;
            instruction: string;
          }>;
        }>;
      };
      isDefault?: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}; 