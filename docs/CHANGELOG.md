# Changelog

## [Unreleased]

### Changed
- Replaced AWS Transcribe with Groq's Whisper-large-v3-turbo model for faster audio transcription
- Removed AWS Transcribe client and related functions from AWS service
- Added new Groq service with transcription functionality
- Added environment variable type declarations
- Enhanced audio transcription to handle large files by automatically splitting them into chunks
- Added automatic WAV conversion for audio chunks

### Added
- New `src/services/groq.ts` file for Groq API integration
- New type declarations in `src/types/env.d.ts`
- Added `VITE_GROQ_API_KEY` to required environment variables
- Added audio file splitting functionality using Web Audio API
- Added WAV format conversion utilities
- Added progress logging for chunk processing