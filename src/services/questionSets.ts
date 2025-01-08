import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

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
  created_at?: string;
}

export async function fetchQuestionSets() {
  try {
    const response = await client.models.QuestionSet.list();
    return response.data;
  } catch (error) {
    console.error('Error fetching question sets:', error);
    throw error;
  }
}

export async function createQuestionSet(set: Omit<QuestionSet, 'id' | 'created_at'>) {
  try {
    const response = await client.models.QuestionSet.create({
      ...set,
      created_at: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating question set:', error);
    throw error;
  }
}

export async function updateQuestionSet(id: string, updates: Partial<QuestionSet>) {
  try {
    const response = await client.models.QuestionSet.update({
      id,
      ...updates,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating question set:', error);
    throw error;
  }
}

export async function deleteQuestionSet(id: string) {
  try {
    const response = await client.models.QuestionSet.delete({
      id
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting question set:', error);
    throw error;
  }
} 