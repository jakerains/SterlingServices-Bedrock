import { a } from '@aws-amplify/backend';

export const schema = a.schema({
  QuestionSet: a.model({
    name: a.string().required(),
    description: a.string().required(),
    questions: a.json().required(),
    isDefault: a.boolean(),
  }).authorization(allow => [
    // Allow authenticated users to perform all operations
    allow.authenticated().to(['create', 'read', 'update', 'delete']),
    // Allow public read access using API key
    allow.publicApiKey().to(['read'])
  ])
}); 