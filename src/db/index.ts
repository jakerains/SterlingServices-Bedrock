import { openDB, type DBSchema } from 'idb';
import sowQuestions from '../../Questions.json';

interface QuestionSetDB extends DBSchema {
  'question-sets': {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      questions: {
        project_questions: {
          category: string;
          questions: (string | { text: string; instruction?: string })[];
        }[];
      };
      created_at: Date;
    };
  };
}

const dbPromise = openDB<QuestionSetDB>('question-sets-db', 1, {
  upgrade(db) {
    db.createObjectStore('question-sets', { keyPath: 'id' });
  },
});

export async function getAllQuestionSets() {
  const db = await dbPromise;
  return db.getAll('question-sets');
}

export async function addQuestionSet(set: Omit<QuestionSetDB['question-sets']['value'], 'id' | 'created_at'>) {
  const db = await dbPromise;
  const id = `set-${Date.now()}`;
  await db.add('question-sets', {
    ...set,
    id,
    created_at: new Date()
  });
  return id;
}

export async function updateQuestionSet(id: string, set: Partial<QuestionSetDB['question-sets']['value']>) {
  const db = await dbPromise;
  const existingSet = await db.get('question-sets', id);
  if (!existingSet) throw new Error('Question set not found');
  
  await db.put('question-sets', {
    ...existingSet,
    ...set,
  });
}

export async function deleteQuestionSet(id: string) {
  const db = await dbPromise;
  await db.delete('question-sets', id);
}

export async function initializeDefaultSet() {
  const db = await openDB<QuestionSetDB>('question-sets-db', 1);
  const defaultSet = await db.get('question-sets', 'default');
  
  if (!defaultSet) {
    await db.add('question-sets', {
      id: 'default',
      name: 'Default Analysis Set',
      description: 'Default question set for content analysis',
      questions: sowQuestions,
      created_at: new Date()
    });
  }
  return defaultSet;
}