import { generateClient } from 'aws-amplify/api';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from '@aws-sdk/client-transcribe';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const debug = (action: string, data?: any) => {
  console.log('[AWS]', action, data || '');
};

// Validate environment variables
const validateConfig = () => {
  // Log all environment variables (without sensitive values)
  debug('Environment Check', {
    hasRegion: !!import.meta.env.VITE_AWS_REGION,
    hasBucket: !!import.meta.env.VITE_AWS_BUCKET_NAME,
    hasAccessKey: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    hasSecretKey: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    region: import.meta.env.VITE_AWS_REGION,
    bucket: import.meta.env.VITE_AWS_BUCKET_NAME
  });

  const region = import.meta.env.VITE_AWS_REGION;
  const bucket = import.meta.env.VITE_AWS_BUCKET_NAME;
  const hasAccessKey = !!import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const hasSecretKey = !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
  const modelId = 'amazon.nova-lite-v1:0'; // Hardcoded model ID

  if (!region || !bucket || !hasAccessKey || !hasSecretKey) {
    const missing = [];
    if (!region) missing.push('VITE_AWS_REGION');
    if (!bucket) missing.push('VITE_AWS_BUCKET_NAME');
    if (!hasAccessKey) missing.push('VITE_AWS_ACCESS_KEY_ID');
    if (!hasSecretKey) missing.push('VITE_AWS_SECRET_ACCESS_KEY');
    throw new Error(`Missing required AWS configuration: ${missing.join(', ')}`);
  }

  debug('Config Validated', { 
    region, 
    bucket, 
    modelId,
    hasCredentials: hasAccessKey && hasSecretKey 
  });

  return { region, bucket, modelId };
};

// Initialize AWS clients
const config = validateConfig();
debug('Init', { region: config.region });

const s3Client = new S3Client({
  region: config.region,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const transcribeClient = new TranscribeClient({
  region: config.region,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const bedrockClient = new BedrockRuntimeClient({
  region: config.region,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

// Upload file to S3
export async function uploadToS3(
  file: File, 
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  debug('Upload', { fileName, type: file.type, size: file.size });
  
  try {
    // For files larger than 5MB, use multipart upload
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
    
    if (file.size > CHUNK_SIZE) {
      debug('Using multipart upload', { size: file.size, chunkSize: CHUNK_SIZE });
      
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);
      
      // Calculate number of chunks
      const chunks = Math.ceil(file.size / CHUNK_SIZE);
      debug('Chunking file', { chunks });
      
      for (let i = 0; i < chunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = fileData.slice(start, end);
        
        debug('Uploading chunk', { chunk: i + 1, start, end });
        
        const command = new PutObjectCommand({
          Bucket: config.bucket,
          Key: `${fileName}.part${i}`,
          Body: chunk,
          ContentType: file.type,
        });

        await s3Client.send(command);
        debug('Chunk uploaded', { chunk: i + 1 });
        
        // Calculate and report progress
        const progress = Math.round(((i + 1) / chunks) * 90); // Leave 10% for final combination
        onProgress?.(progress);
      }
      
      // After all chunks are uploaded, combine them
      debug('Combining chunks');
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: fileName,
        Body: fileData,
        ContentType: file.type,
      });

      await s3Client.send(command);
      debug('Upload complete', { fileName });
      onProgress?.(100);
    } else {
      // For small files, use regular upload
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);
      
      onProgress?.(50); // Show some progress for small files
      
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: fileName,
        Body: fileData,
        ContentType: file.type,
      });

      await s3Client.send(command);
      debug('Upload complete', { fileName });
      onProgress?.(100);
    }
  } catch (error) {
    debug('Upload error', { error });
    throw error;
  }
}

// Start transcription job
export async function startTranscription(fileName: string, jobName: string): Promise<void> {
  debug('StartTranscription', { fileName, jobName });
  
  try {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    const mediaFormat = fileExtension === 'mp3' ? 'mp3' :
                       fileExtension === 'mp4' ? 'mp4' :
                       fileExtension === 'wav' ? 'wav' :
                       fileExtension === 'flac' ? 'flac' :
                       fileExtension === 'm4a' ? 'm4a' :
                       undefined;

    if (!mediaFormat) {
      throw new Error(`Unsupported media format: ${fileExtension}`);
    }

    const command = new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      Media: { MediaFileUri: `s3://${config.bucket}/${fileName}` },
      MediaFormat: mediaFormat,
      LanguageCode: 'en-US',
      OutputBucketName: config.bucket,
    });

    await transcribeClient.send(command);
    debug('Transcription job started', { jobName });
  } catch (error) {
    debug('Transcription start error', { error });
    throw error;
  }
}

// Get transcription job status
export async function getTranscriptionStatus(jobName: string) {
  debug('GetTranscriptionStatus', { jobName });
  
  try {
    const command = new GetTranscriptionJobCommand({
      TranscriptionJobName: jobName,
    });

    const response = await transcribeClient.send(command);
    debug('Got transcription status', { 
      jobName,
      status: response.TranscriptionJob?.TranscriptionJobStatus
    });
    
    return response;
  } catch (error) {
    debug('Get status error', { error });
    throw error;
  }
}

// Delete file from S3
export async function deleteFromS3(fileName: string): Promise<boolean> {
  debug('Delete', { fileName });
  
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: fileName,
    });

    await s3Client.send(command);
    debug('Delete complete', { fileName });
    return true;
  } catch (error) {
    debug('Delete error', { error });
    return false;
  }
}

// Analyze with Bedrock
export async function analyzeWithBedrock(
  text: string,
  questions: any,
  setStatusMessage: (message: string) => void,
  setProgress: (progress: number) => void
) {
  debug('Analyze', { textLength: text.length, questionCount: questions?.project_questions?.length });
  
  try {
    const results = [];
    let totalQuestions = 0;
    let completedQuestions = 0;

    for (const category of questions.project_questions) {
      totalQuestions += category.questions.length;
    }

    for (const category of questions.project_questions) {
      const answers = [];

      for (const question of category.questions) {
        setStatusMessage(`Analyzing: ${question.text}`);
        
        const prompt = `Based on the following transcript, please answer this question: "${question.text}"

Transcript:
${text}

Please provide a clear and concise answer based solely on the information provided in the transcript. If the information is not available in the transcript, please state that explicitly.`;

        const command = new InvokeModelCommand({
          modelId: config.modelId,
          contentType: 'application/json',
          accept: 'application/json',
          body: JSON.stringify({
            inferenceConfig: {
              max_new_tokens: 1000
            },
            messages: [
              {
                role: "user",
                content: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          }),
        });

        debug('Bedrock request', { 
          modelId: config.modelId,
          promptLength: prompt.length
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        let answer = 'No response received';
        debug('Bedrock response', { 
          status: response.$metadata.httpStatusCode,
          hasOutput: !!responseBody.output,
          hasMessage: !!responseBody.output?.message,
          hasContent: !!responseBody.output?.message?.content
        });
        
        if (responseBody.output?.message?.content?.[0]?.text) {
          answer = responseBody.output.message.content[0].text.trim();
        } else {
          debug('Invalid response format', responseBody);
          throw new Error('Invalid response format from Bedrock');
        }
        
        answers.push({
          question: question.text,
          answer,
        });

        completedQuestions++;
        const progress = Math.round((completedQuestions / totalQuestions) * 100);
        setProgress(progress);
        
        debug('Question analyzed', { 
          question: question.text,
          progress,
          responseLength: answer.length
        });
      }

      results.push({
        category: category.category,
        answers,
      });
    }

    debug('Analysis complete', { resultCount: results.length });
    return results;
  } catch (error) {
    debug('Analysis error', { error });
    throw error;
  }
}

// QuestionSet Type
type QuestionSet = {
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

// Generate the GraphQL client
const client = generateClient<{ QuestionSet: QuestionSet }>();

// QuestionSet operations
export const createQuestionSet = async (input: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>) => {
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

    const result = (await client.graphql({
      query: mutation,
      variables: {
        input: {
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    })) as GraphQLResult<{
      createQuestionSet: QuestionSet;
    }>;

    return result.data?.createQuestionSet;
  } catch (error) {
    console.error('Error creating question set:', error);
    throw error;
  }
};

export const updateQuestionSet = async (id: string, input: Partial<Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>>) => {
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
          ...input,
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
};

export const deleteQuestionSet = async (id: string) => {
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
};

export const fetchQuestionSets = async () => {
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
};