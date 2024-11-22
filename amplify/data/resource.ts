import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  QuestionSet: a.model({
    name: a.string().required(),
    description: a.string(),
    questions: a.json(),  // This will store the complex questions structure
    created_at: a.datetime(),
  }).authorization(allow => [
    // Allow authenticated users to perform all operations
    allow.authenticated().to(['create', 'read', 'update', 'delete']),
    // Allow public read access using API key
    allow.publicApiKey().to(['read'])
  ]),

  AnalysisResult: a.model({
    fileName: a.string().required(),
    content: a.string(),
    results: a.json(),  // Store analysis results
    created_at: a.datetime(),
    owner: a.string(),  // To track who created the analysis
  }).authorization(allow => [
    // Only authenticated users can create/read/update/delete their own records
    allow.owner().to(['create', 'read', 'update', 'delete']),
    // Allow public read access using API key
    allow.publicApiKey().to(['read'])
  ])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // Use user pool (Cognito) as default auth mode
    defaultAuthorizationMode: 'userPool',
    // Also enable API key for public access
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});
