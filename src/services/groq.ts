import toast from 'react-hot-toast';

// Debug logger helper
const debug = (service: string, action: string, data?: any) => {
  console.log(`[Groq:${service}]`, action, data || '');
};

// Load lamejs from CDN
const loadLame = async () => {
  if (!(window as any).lamejs) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js';
    script.async = true;
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return (window as any).lamejs;
};

// Constants
const MAX_FILE_SIZE_MB = 25; // Groq's file size limit
const MAX_TOTAL_SIZE_MB = 100; // Maximum total file size we'll handle
const BYTES_PER_MB = 1024 * 1024;
const TARGET_SAMPLE_RATE = 16000; // 16 kHz
const MONO_CHANNELS = 1;
const TARGET_BITRATE = 16; // Very low bitrate for speech (16kbps)

// Validate environment variables
const validateEnvVariables = () => {
  const required = ['VITE_GROQ_API_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  debug('Config', 'Environment variables validated', {
    hasGroqKey: !!import.meta.env.VITE_GROQ_API_KEY
  });
  
  return true;
};

// Helper function to validate file size
const validateFileSize = (file: File): void => {
  const fileSizeMB = file.size / BYTES_PER_MB;
  if (fileSizeMB > MAX_TOTAL_SIZE_MB) {
    throw new Error(`File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size of ${MAX_TOTAL_SIZE_MB}MB`);
  }
  debug('Validate', 'File size validated', { fileSizeMB: fileSizeMB.toFixed(2) });
};

// Helper function to preprocess audio
const preprocessAudio = async (file: File, setProgress: (progress: number) => void, setStatusMessage: (msg: string) => void): Promise<File> => {
  const fileSizeMB = file.size / BYTES_PER_MB;
  
  // If file is under 25MB, return it as is
  if (fileSizeMB <= MAX_FILE_SIZE_MB) {
    debug('Preprocess', 'File is under size limit, skipping preprocessing', {
      size: `${fileSizeMB.toFixed(2)}MB`
    });
    setStatusMessage(`Audio file is under ${MAX_FILE_SIZE_MB}MB limit (${fileSizeMB.toFixed(2)}MB), using as is.`);
    return file;
  }

  debug('Preprocess', 'Starting audio preprocessing');
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: TARGET_SAMPLE_RATE
  });

  try {
    setProgress(5);
    setStatusMessage('Reading audio file...');
    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    setProgress(10);
    
    // Decode the audio
    debug('Preprocess', 'Decoding audio');
    setStatusMessage('Decoding audio file...');
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    setProgress(15);
    
    const originalSpecs = {
      duration: `${audioBuffer.duration.toFixed(2)}s`,
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels,
      size: `${fileSizeMB.toFixed(2)}MB`
    };
    
    debug('Preprocess', 'Original audio specs', originalSpecs);
    setStatusMessage(`Original Audio: ${originalSpecs.size}, ${originalSpecs.channels} channels, ${originalSpecs.sampleRate}Hz, ${originalSpecs.duration}`);

    // Process audio to mono and correct sample rate
    debug('Preprocess', 'Converting to mono and resampling');
    setStatusMessage('Converting to mono and optimizing sample rate...');

    // Create a mono buffer at target sample rate
    const processedBuffer = audioContext.createBuffer(
      MONO_CHANNELS,
      Math.ceil(audioBuffer.duration * TARGET_SAMPLE_RATE),
      TARGET_SAMPLE_RATE
    );

    // Mix down to mono and handle resampling
    const outputData = processedBuffer.getChannelData(0);
    const channelData = [];
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      channelData.push(audioBuffer.getChannelData(channel));
    }

    // Calculate the sample rate conversion ratio
    const ratio = audioBuffer.sampleRate / TARGET_SAMPLE_RATE;
    
    for (let i = 0; i < outputData.length; i++) {
      const inputIndex = Math.floor(i * ratio);
      let sum = 0;
      // Mix all channels
      for (let channel = 0; channel < channelData.length; channel++) {
        sum += channelData[channel][inputIndex] || 0;
      }
      // Average the channels
      outputData[i] = sum / channelData.length;
    }

    setProgress(25);

    // Convert to MP3 with very low bitrate
    debug('Preprocess', 'Converting to low bitrate MP3');
    setStatusMessage('Converting to optimized MP3...');

    // Convert float32 samples to int16
    const samples = new Int16Array(processedBuffer.length);
    for (let i = 0; i < processedBuffer.length; i++) {
      const sample = Math.max(-1, Math.min(1, outputData[i]));
      samples[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }

    // Load and initialize MP3 encoder
    const Lame = await loadLame();
    const mp3encoder = new Lame.Mp3Encoder(MONO_CHANNELS, TARGET_SAMPLE_RATE, TARGET_BITRATE);
    
    // Encode in chunks
    const mp3Data = [];
    const CHUNK_SIZE = 1152; // Must be a multiple of 576 for lamejs
    
    for (let i = 0; i < samples.length; i += CHUNK_SIZE) {
      const chunk = samples.subarray(i, Math.min(i + CHUNK_SIZE, samples.length));
      const encoded = mp3encoder.encodeBuffer(chunk);
      if (encoded.length > 0) {
        mp3Data.push(new Int8Array(encoded));
      }
    }

    // Get the last chunk and create the final MP3 file
    const finalChunk = mp3encoder.flush();
    if (finalChunk.length > 0) {
      mp3Data.push(new Int8Array(finalChunk));
    }

    const processedBlob = new Blob(mp3Data, { type: 'audio/mp3' });
    const processedFile = new File([processedBlob], 'processed.mp3', { type: 'audio/mp3' });
    
    const processedSpecs = {
      duration: `${processedBuffer.duration.toFixed(2)}s`,
      sampleRate: processedBuffer.sampleRate,
      channels: processedBuffer.numberOfChannels,
      size: `${(processedFile.size / BYTES_PER_MB).toFixed(2)}MB`,
      compressionRatio: `${(file.size / processedFile.size).toFixed(2)}x`,
      bitrate: `${TARGET_BITRATE}kbps`
    };
    
    debug('Preprocess', 'Processing completed', processedSpecs);
    setStatusMessage(
      `Audio Processing Complete:\n` +
      `Original: ${originalSpecs.size}, ${originalSpecs.channels} channels, ${originalSpecs.sampleRate}Hz\n` +
      `Processed: ${processedSpecs.size}, mono, 16kHz, ${processedSpecs.bitrate} (${processedSpecs.compressionRatio}x smaller)`
    );

    if (processedFile.size > MAX_FILE_SIZE_MB * BYTES_PER_MB) {
      throw new Error(`Processed file (${(processedFile.size / BYTES_PER_MB).toFixed(2)}MB) still exceeds Groq's ${MAX_FILE_SIZE_MB}MB limit`);
    }

    return processedFile;
  } catch (error) {
    debug('Preprocess', 'Error preprocessing audio', { error });
    throw error;
  } finally {
    try {
      await audioContext.close();
    } catch (error) {
      console.warn('Failed to close audio context:', error);
    }
  }
};

// Main transcription function
export const transcribeAudio = async (audioFile: File, setProgress: (progress: number) => void, setStatusMessage: (msg: string) => void): Promise<string> => {
  if (!validateEnvVariables()) {
    throw new Error('Missing required Groq configuration');
  }

  try {
    // Validate file size first
    validateFileSize(audioFile);
    
    debug('Transcribe', 'Starting transcription process', { 
      fileName: audioFile.name,
      fileSize: `${(audioFile.size / BYTES_PER_MB).toFixed(2)}MB`
    });

    // Preprocess audio only if needed
    const fileToTranscribe = await preprocessAudio(audioFile, setProgress, setStatusMessage);

    // Send to Groq for transcription
    debug('Transcribe', 'Sending to Groq Whisper API');
    setStatusMessage('Sending audio to Groq for transcription...');
    setProgress(50);

    const formData = new FormData();
    formData.append('file', fileToTranscribe);
    formData.append('model', 'whisper-large-v3-turbo');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      debug('Transcribe', 'Transcription failed', { 
        status: response.status, 
        statusText: response.statusText,
        error: errorData 
      });
      throw new Error(`Transcription failed: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    setProgress(100);
    setStatusMessage('Transcription completed successfully');
    
    debug('Transcribe', 'Transcription completed', { 
      textLength: result.text.length 
    });
    
    return result.text.trim();
  } catch (error: any) {
    console.error('Groq Transcription Error:', error);
    setStatusMessage(`Error: ${error.message}`);
    throw error;
  }
}; 