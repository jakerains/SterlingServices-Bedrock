import { Category, Question } from '../store/questions';
import mammoth from 'mammoth';

const debug = (action: string, data?: any) => {
  console.log('[QuestionParser]', action, data || '');
};

/**
 * Parse a text document into a question set.
 * Expected format:
 * Category Name
 * - Question 1
 * - Question 2 [instruction: specific instruction]
 * 
 * Another Category
 * - Question 3
 * - Question 4 [instruction: another instruction]
 */
export async function parseDocumentToQuestions(file: File): Promise<Category[]> {
  try {
    let text = '';
    
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse Word document
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
      debug('Raw Word document text', { text });
    } else {
      // Parse text file
      text = await file.text();
    }

    debug('Parsing document', { fileType: file.type, textLength: text.length });

    // Split into lines and remove empty lines
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line)
      // Clean up common bullet point characters and formatting
      .map(line => line.replace(/^[•\-\u2022\u2023\u2043\u204C\u204D\u2219\u25D8\u25E6\u2619\u2765\u2767\u29BE\u29BF]\s*/, '-'));

    debug('Processed lines', { lineCount: lines.length, lines });

    const categories: Category[] = [];
    let currentCategory: Category | null = null;
    let isInCategory = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';
      
      // If current line doesn't start with - and next line starts with -, it's likely a category
      if (!line.startsWith('-') && (nextLine.startsWith('-') || nextLine.startsWith('•'))) {
        if (currentCategory) {
          if (currentCategory.questions.length > 0) {
            categories.push(currentCategory);
          }
        }
        currentCategory = {
          category: line,
          questions: []
        };
        isInCategory = true;
      } 
      // If line starts with - and we're in a category, it's a question
      else if ((line.startsWith('-') || line.startsWith('•')) && currentCategory && isInCategory) {
        const questionText = line.replace(/^[-•]\s*/, '');
        
        // Check for instructions in [instruction: xyz] format
        const instructionMatch = questionText.match(/\[instruction:\s*([^\]]+)\]/i);
        const instruction = instructionMatch ? instructionMatch[1].trim() : '';
        const text = questionText.replace(/\[instruction:\s*[^\]]+\]/i, '').trim();
        
        if (text) {
          currentCategory.questions.push({
            text,
            instruction
          });
        }
      }
      // If we hit a blank line or a line that doesn't match patterns, close current category
      else if (currentCategory && currentCategory.questions.length > 0) {
        categories.push(currentCategory);
        currentCategory = null;
        isInCategory = false;
      }
    }

    // Add the last category if it has questions
    if (currentCategory && currentCategory.questions.length > 0) {
      categories.push(currentCategory);
    }

    debug('Parsed categories', { 
      categoryCount: categories.length,
      questionCount: categories.reduce((sum, cat) => sum + cat.questions.length, 0),
      categories
    });

    return categories;
  } catch (error) {
    debug('Error parsing document', { error });
    throw new Error('Failed to parse document: ' + (error as Error).message);
  }
} 