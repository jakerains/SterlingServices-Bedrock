import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { sterlingLogoBase64 } from './constants';

function processMarkdown(text: string): any[] {
  // Split text into lines
  const lines = text.split('\n');
  const processedContent: any[] = [];
  let currentList: any[] = [];
  let inList = false;

  lines.forEach((line) => {
    // Handle bold text
    line = line.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Check if line is a numbered list item
    const numberedMatch = line.match(/^\d+\.\s+(.*)/);
    // Check if line is a bullet point
    const bulletMatch = line.match(/^[-•]\s+(.*)/);

    if (numberedMatch || bulletMatch) {
      if (!inList) {
        inList = true;
        currentList = [];
      }
      currentList.push({
        text: (numberedMatch || bulletMatch)[1],
        margin: [10, 0, 0, 5]
      });
    } else {
      if (inList) {
        processedContent.push({
          ul: currentList,
          margin: [20, 5, 0, 10]
        });
        inList = false;
        currentList = [];
      }
      if (line.trim()) {
        processedContent.push({
          text: line,
          margin: [0, 0, 0, 5]
        });
      }
    }
  });

  // Add any remaining list items
  if (inList && currentList.length > 0) {
    processedContent.push({
      ul: currentList,
      margin: [20, 5, 0, 10]
    });
  }

  return processedContent;
}

export function generatePDF(results: any[]) {
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    styles: {
      logo: {
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      title: {
        fontSize: 20,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#000000'
      },
      subtitle: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 30],
        color: '#000000'
      },
      category: {
        fontSize: 14,
        bold: true,
        margin: [0, 15, 0, 10],
        color: '#000000'
      },
      question: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5],
        color: '#000000'
      },
      answer: {
        fontSize: 11,
        margin: [0, 0, 0, 10],
        color: '#000000',
        lineHeight: 1.4
      }
    },
    content: [
      {
        image: sterlingLogoBase64,
        width: 200,
        style: 'logo'
      },
      {
        text: 'Sterling Services Analysis',
        style: 'title'
      },
      ...results.map((category: any) => [
        {
          text: category.category,
          style: 'category'
        },
        ...category.answers.map((qa: any) => [
          {
            text: qa.question,
            style: 'question'
          },
          {
            stack: processMarkdown(qa.answer),
            style: 'answer'
          }
        ]).flat()
      ]).flat()
    ]
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBuffer((buffer: any) => {
        resolve(buffer);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function generateTitle(results: any[]): string {
  const allText = results.flatMap(category => 
    category.answers.map(qa => qa.answer)
  ).join(' ').toLowerCase();
  
  const keyTerms = {
    'software': 'Software Development',
    'cloud': 'Cloud Infrastructure',
    'security': 'Security Assessment',
    'network': 'Network Architecture',
    'data': 'Data Analytics',
    'ai': 'AI Implementation',
    'machine learning': 'ML Strategy',
    'consulting': 'Technical Consulting'
  };

  for (const [term, title] of Object.entries(keyTerms)) {
    if (allText.includes(term)) {
      return `${title} Analysis`;
    }
  }

  return 'Technical Analysis';
} 