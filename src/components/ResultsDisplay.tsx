import { useState } from 'react';
import { useResults } from '../store/results';
import { saveAs } from 'file-saver';
import { generatePDF } from '../utils/pdfGenerator';
import { toast } from 'react-hot-toast';

export default function ResultsDisplay() {
  const results = useResults((state) => state.results);
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  if (!results) return null;

  const downloadResults = async () => {
    try {
      if (selectedFormat === 'pdf') {
        const pdfBuffer = await generatePDF(results);
        const companyName = results[0]?.answers[0]?.answer || 'Client';
        const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
        saveAs(blob, `${companyName} Analysis.pdf`);
      } else {
        switch (selectedFormat) {
          case 'txt':
            const textContent = results
              .map(
                (category) =>
                  `${category.category}\n${'='.repeat(
                    category.category.length
                  )}\n\n${category.answers
                    .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}\n`)
                    .join('\n')}`
              )
              .join('\n\n');
            const textBlob = new Blob([textContent], { type: 'text/plain' });
            saveAs(textBlob, 'results.txt');
            break;
          case 'docx':
            const docxContent = results
              .map(
                (category) =>
                  `${category.category}\n\n${category.answers
                    .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}\n`)
                    .join('\n')}`
              )
              .join('\n\n');
            const docxBlob = new Blob([docxContent], {
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            saveAs(docxBlob, 'results.docx');
            break;
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF');
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Analysis Results
        </h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
            className="rounded-lg border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 shadow-sm"
          >
            <option value="pdf">PDF</option>
            <option value="txt">TXT</option>
            <option value="docx">DOCX</option>
          </select>
          <button
            onClick={downloadResults}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Download Results
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {results.map((category, categoryIndex) => (
          <div
            key={category.category}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-all duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
              {category.category}
            </h3>
            <div className="mt-4 space-y-6">
              {category.answers.map((qa, idx) => (
                <div 
                  key={idx} 
                  className="group rounded-lg bg-gray-50 p-4 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-200">
                        <span className="text-sm font-medium">Q</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 leading-relaxed">
                        {qa.question}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors duration-200">
                        <span className="text-sm font-medium">A</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {qa.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}