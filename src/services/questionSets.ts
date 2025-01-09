import { generateClient } from 'aws-amplify/api';
import { GraphQLResult } from '@aws-amplify/api-graphql';

export interface QuestionSet {
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
  createdAt?: string;
  updatedAt?: string;
}

const client = generateClient<{ QuestionSet: QuestionSet }>();

export async function fetchQuestionSets() {
  try {
    const query = /* GraphQL */ `
      query ListQuestionSets {
        listQuestionSets {
          items {
            id
            name
            description
            questions
            isDefault
            createdAt
            updatedAt
          }
        }
      }
    `;

    const result = (await client.graphql({
      query,
    })) as GraphQLResult<{
      listQuestionSets: {
        items: QuestionSet[];
      };
    }>;

    return result.data?.listQuestionSets.items || [];
  } catch (error) {
    console.error('Error fetching question sets:', error);
    throw error;
  }
}

export async function createQuestionSet(set: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const mutation = /* GraphQL */ `
      mutation CreateQuestionSet($input: CreateQuestionSetInput!) {
        createQuestionSet(input: $input) {
          id
          name
          description
          questions
          isDefault
          createdAt
          updatedAt
        }
      }
    `;

    // Convert questions to a JSON string since it's stored as a JSON field
    const input = {
      ...set,
      questions: JSON.stringify(set.questions),
      isDefault: set.isDefault || false,
    };

    const result = (await client.graphql({
      query: mutation,
      variables: {
        input,
      },
    })) as GraphQLResult<{
      createQuestionSet: QuestionSet;
    }>;

    if (!result.data?.createQuestionSet) {
      throw new Error('Failed to create question set: No data returned');
    }

    // Parse the questions back from JSON string
    return {
      ...result.data.createQuestionSet,
      questions: JSON.parse(result.data.createQuestionSet.questions as string)
    };
  } catch (error) {
    console.error('Error creating question set:', {
      error,
      errorDetails: error.errors?.[0]?.message,
      input: set
    });
    throw error;
  }
}

export async function updateQuestionSet(id: string, updates: Partial<Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    const mutation = /* GraphQL */ `
      mutation UpdateQuestionSet($input: UpdateQuestionSetInput!) {
        updateQuestionSet(input: $input) {
          id
          name
          description
          questions
          isDefault
          createdAt
          updatedAt
        }
      }
    `;

    const result = (await client.graphql({
      query: mutation,
      variables: {
        input: {
          id,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
    })) as GraphQLResult<{
      updateQuestionSet: QuestionSet;
    }>;

    return result.data?.updateQuestionSet;
  } catch (error) {
    console.error('Error updating question set:', error);
    throw error;
  }
}

export async function deleteQuestionSet(id: string) {
  try {
    const mutation = /* GraphQL */ `
      mutation DeleteQuestionSet($input: DeleteQuestionSetInput!) {
        deleteQuestionSet(input: $input) {
          id
          name
          description
          questions
          isDefault
          createdAt
          updatedAt
        }
      }
    `;

    const result = (await client.graphql({
      query: mutation,
      variables: {
        input: { id },
      },
    })) as GraphQLResult<{
      deleteQuestionSet: QuestionSet;
    }>;

    return result.data?.deleteQuestionSet;
  } catch (error) {
    console.error('Error deleting question set:', error);
    throw error;
  }
} 