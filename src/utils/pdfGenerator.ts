import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { sterlingLogoBase64 } from './constants';

export function generatePDF(results: any[]) {
  // Get company name from first result (Company Information category)
  const companyName = results[0]?.answers[0]?.answer || 'Client';

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    styles: {
      logo: {
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      title: {
        fontSize: 24,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#4F46E5'
      },
      subtitle: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 30],
        color: '#4F46E5'
      }
    },
    content: [
      {
        image: sterlingLogoBase64,
        width: 200,
        style: 'logo'
      },
      {
        text: companyName,
        style: 'title'
      },
      {
        text: 'Analysis Results',
        style: 'subtitle'
      },
      ...results.map((category: any) => [
        {
          text: category.category,
          fontSize: 16,
          bold: true,
          margin: [0, 15, 0, 10]
        },
        ...category.answers.map((qa: any) => [
          {
            text: qa.question,
            fontSize: 12,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          {
            text: qa.answer,
            fontSize: 12,
            margin: [0, 0, 0, 10]
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