# Sterling Services: Analysis ToolKit 🛠️

[![Version](https://img.shields.io/badge/version-3.5.1-blue.svg)](https://github.com/jakerains/sterling-services-bedrock)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20Transcribe-orange.svg)](https://aws.amazon.com/)

<div align="center">
  <img src="public/images/sterling.png" alt="Sterling Services Logo" width="200"/>
  <p><em>Automated Analysis Tool for Client Meetings and Conversations</em></p>
</div>

## 🌟 Overview

The Sterling Services: Analysis ToolKit is a powerful React-based application that revolutionizes the way client meetings and conversations are analyzed. Leveraging AWS Bedrock with Claude 3.5 Haiku, it provides intelligent analysis and generates comprehensive answers to predefined questions.

## ✨ Key Features

🎙️ **Advanced Audio Processing**
- Real-time audio transcription using AWS Transcribe
- Automatic company name and entity detection
- Support for multiple audio formats (MP3, WAV, M4A)

🤖 **AI-Powered Analysis**
- Integration with AWS Bedrock (Claude 3.5 Haiku model)
- Intelligent context understanding
- Customizable analysis parameters

📊 **Data Management**
- Persistent question set management with IndexedDB
- Customizable question templates
- Secure data handling

📝 **Rich Output Options**
- Professional PDF reports with styled formatting
- Clean TXT output for plain text needs
- Properly structured DOCX documents
- Browser-optimized file generation

💫 **Modern User Interface**
- Sleek, responsive design with Tailwind CSS
- Real-time progress tracking with visual feedback
- Enhanced UI with glow effects and animations
- Intuitive question management interface

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- AWS Account with access to:
  - AWS Bedrock (Claude 3.5 Haiku model)
  - AWS Transcribe
  - S3 Bucket
- Environment variables configured

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/jakerains/sterling-services-bedrock.git
   cd sterling-services-bedrock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_AWS_ACCESS_KEY_ID=your_access_key
   VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
   VITE_AWS_REGION=your_region
   VITE_AWS_BUCKET_NAME=your_bucket
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test:bedrock` - Test Bedrock integration

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- Twitter: [@genaijake](https://twitter.com/genaijake)
- Issues: [GitHub Issues](https://github.com/jakerains/sterling-services-bedrock/issues)

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---
<div align="center">
  <sub>Made with 💚 by GenAI Jake</sub>
</div>