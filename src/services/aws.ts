import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import toast from 'react-hot-toast';

// Debug logger helper
const debug = (service: string, action: string, data?: any) => {
  console.log(`[AWS:${service}]`, action, data || '');
};

// Validate environment variables
const validateEnvVariables = () => {
  const required = [
    'VITE_AWS_ACCESS_KEY_ID',
    'VITE_AWS_SECRET_ACCESS_KEY',
    'VITE_AWS_REGION'
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  debug('Config', 'Environment variables validated', {
    region: import.meta.env.VITE_AWS_REGION,
    hasAccessKey: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    hasSecretKey: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  });
  
  return true;
};

// Initialize AWS client with error handling
const initializeAWSClient = () => {
  if (!validateEnvVariables()) {
    throw new Error('Missing required AWS configuration');
  }

  const config = {
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
    region: import.meta.env.VITE_AWS_REGION,
  };

  try {
    debug('Init', 'Initializing AWS Bedrock client', { region: config.region });
    return new BedrockRuntimeClient(config);
  } catch (error) {
    debug('Init', 'Error initializing AWS Bedrock client', { error });
    throw new Error('Failed to initialize AWS Bedrock service');
  }
};

let bedrockClient: BedrockRuntimeClient;

try {
  bedrockClient = initializeAWSClient();
} catch (error) {
  console.error('AWS initialization error:', error);
  toast.error('Failed to initialize AWS Bedrock service. Please check your configuration.');
}

interface Answer {
  question: string;
  answer: string;
}

interface CategoryResult {
  category: string;
  answers: Answer[];
}

export const analyzeWithBedrock = async (text: string, questions: any, setStatusMessage: (msg: string) => void, setProgress: (progress: number) => void): Promise<CategoryResult[]> => {
  if (!bedrockClient) throw new Error('AWS Bedrock service not initialized');

  const MODEL_ID = 'us.anthropic.claude-3-5-haiku-20241022-v1:0';
  const results: CategoryResult[] = [];

  // First, get the company name
  setStatusMessage('Identifying company from transcript...');
  
  const companyCommand = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      messages: [
        {
          role: "user",
          content: `From the following transcript, identify ONLY the name of the company being discussed (not Sterling or any vendor names). Return ONLY the company name, nothing else: \n\n${text}`
        }
      ],
      max_tokens: 100,
      temperature: 0.1
    })
  });

  let companyName;
  try {
    const companyResponse = await bedrockClient.send(companyCommand);
    const companyResponseBody = JSON.parse(new TextDecoder().decode(companyResponse.body));
    companyName = companyResponseBody.content[0].text.trim();
  } catch (error) {
    console.error('Error getting company name:', error);
    companyName = 'Client';
  }

  // Add company name as first result
  results.push({
    category: "Company Information",
    answers: [{
      question: "Client Company Name",
      answer: companyName
    }]
  });

  // Add total questions count for progress calculation
  const totalCategories = questions.project_questions.length;
  let completedCategories = 0;

  const processCategory = async (category: any) => {
    try {
      setStatusMessage(`Processing category: ${category.category}`);
      
      const categoryResults: CategoryResult = {
        category: category.category,
        answers: [],
      };

      // Process questions sequentially instead of concurrently
      for (const question of category.questions) {
        const questionText = typeof question === 'string' ? question : question.text;
        
        try {
          const command = new InvokeModelCommand({
            modelId: MODEL_ID,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
              anthropic_version: "bedrock-2023-05-31",
              messages: [
                {
                  role: "user",
                  content: `Context: ${text}\n\nQuestion: ${questionText}`
                }
              ],
              max_tokens: 2048,
              temperature: 0.7
            })
          });

          const response = await bedrockClient.send(command);
          const responseBody = JSON.parse(new TextDecoder().decode(response.body));
          
          categoryResults.answers.push({
            question: questionText,
            answer: responseBody.content[0].text,
          });
        } catch (error) {
          console.error('Bedrock analysis error:', error);
          categoryResults.answers.push({
            question: questionText,
            answer: 'Error: Unable to analyze this question.',
          });
        }
      }

      completedCategories++;
      setProgress(Math.round((completedCategories / totalCategories) * 100));
      
      return categoryResults;
    } catch (error) {
      console.error('Category processing error:', error);
      return {
        category: category.category,
        answers: category.questions.map((q: any) => ({
          question: typeof q === 'string' ? q : q.text,
          answer: 'Error: Unable to process this category.',
        })),
      };
    }
  };

  // Process categories sequentially
  for (const category of questions.project_questions) {
    const result = await processCategory(category);
    results.push(result);
  }

  return results;
};