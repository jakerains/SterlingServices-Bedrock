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
  const region = import.meta.env.VITE_AWS_REGION;
  const bucket = import.meta.env.VITE_AWS_BUCKET_NAME;
  const hasAccessKey = !!import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const hasSecretKey = !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

  debug('Config', { region, bucket, hasAccessKey, hasSecretKey });

  if (!region || !bucket || !hasAccessKey || !hasSecretKey) {
    throw new Error('Missing required AWS configuration');
  }

  return { region, bucket };
};

// Initialize AWS clients
const config = validateConfig();
debug('Init', { region: config.region });

// Common credentials config
const credentials = {
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
};

const s3Client = new S3Client({
  region: config.region,
  credentials,
});

const transcribeClient = new TranscribeClient({
  region: config.region,
  credentials,
});

const bedrockClient = new BedrockRuntimeClient({
  region: config.region,
  credentials,
});

// Upload file to S3
export async function uploadToS3(file: File, fileName: string): Promise<void> {
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
    } else {
      // For small files, use regular upload
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);
      
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: fileName,
        Body: fileData,
        ContentType: file.type,
      });

      await s3Client.send(command);
      debug('Upload complete', { fileName });
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
    const command = new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      Media: { MediaFileUri: `s3://${config.bucket}/${fileName}` },
      MediaFormat: fileName.split('.').pop()?.toLowerCase(),
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
      status: response.TranscriptionJob?.TranscriptionJobStatus,
      progress: response.TranscriptionJob?.Progress
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
          modelId: import.meta.env.VITE_AWS_BEDROCK_MODEL_ID,
          contentType: 'application/json',
          accept: 'application/json',
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            inferenceConfig: {
              maxTokens: 500,
              temperature: 0.7,
              topP: 0.9,
              stopSequences: []
            }
          }),
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        let answer = 'No response received';
        if (responseBody.output?.message?.content?.[0]?.text) {
          answer = responseBody.output.message.content[0].text.trim();
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