# Sterling Services: Analysis ToolKit

## Overview

The Sterling Services: Analysis ToolKit is a React-based application designed to automate and streamline the process of analyzing client meetings and conversations. It uses AWS Bedrock with Claude 3.5 Haiku to analyze transcripts and generate comprehensive answers to predefined analysis questions.

## Features

- Audio transcription using AWS Transcribe
- Automatic company name detection
- AI-powered analysis using AWS Bedrock and Claude 3.5 Haiku
- Persistent question set management with IndexedDB
- Real-time progress tracking
- Multiple output formats (PDF, TXT, DOCX)
- Responsive React-based UI with Tailwind CSS

## Requirements

- Node.js 18+
- AWS Account with access to:
  - AWS Bedrock (Claude 3.5 Haiku model)
  - AWS Transcribe
  - S3 Bucket
- Environment variables configured

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sterling-services-toolkit.git
   cd sterling-services-toolkit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   VITE_AWS_ACCESS_KEY_ID=your_access_key
   VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
   VITE_AWS_REGION=your_region
   VITE_AWS_BUCKET_NAME=your_bucket
   ```

## Development

Run the development server:
```bash
npm run dev
```

## Contributing

Contributions to improve the Sterling Services: Analysis ToolKit are welcome. Please feel free to submit pull requests or open issues to suggest improvements or report bugs.

## License

MIT License

Copyright (c) 2024 GenAI Jake

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contact

For any queries or support, please contact @genaijake on X (formerly Twitter).

## Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for details on recent changes and version history.