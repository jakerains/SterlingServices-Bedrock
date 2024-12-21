declare module 'lamejs' {
  class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number);
    encodeBuffer(buffer: Int16Array): Int8Array;
    flush(): Int8Array;
  }

  export default {
    Mp3Encoder
  };
} 