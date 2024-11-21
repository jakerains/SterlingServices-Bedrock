import { useState } from 'react';
import { useResults } from '../store/results';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

export default function ResultsDisplay() {
  const results = useResults((state) => state.results);
  const [selectedFormat, setSelectedFormat] = useState<'txt' | 'pdf' | 'docx'>('txt');

  if (!results) return null;

  const downloadResults = () => {
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

      case 'pdf':
        const pdf = new jsPDF();
        let yOffset = 20;

        results.forEach((category) => {
          if (yOffset > 250) {
            pdf.addPage();
            yOffset = 20;
          }

          pdf.setFontSize(16);
          pdf.text(category.category, 20, yOffset);
          yOffset += 10;

          pdf.setFontSize(12);
          category.answers.forEach((qa) => {
            if (yOffset > 250) {
              pdf.addPage();
              yOffset = 20;
            }

            pdf.setFont(undefined, 'bold');
            const lines1 = pdf.splitTextToSize(`Q: ${qa.question}`, 170);
            pdf.text(lines1, 20, yOffset);
            yOffset += lines1.length * 7;

            pdf.setFont(undefined, 'normal');
            const lines2 = pdf.splitTextToSize(`A: ${qa.answer}`, 170);
            pdf.text(lines2, 20, yOffset);
            yOffset += lines2.length * 7 + 10;
          });

          yOffset += 10;
        });

        pdf.save('results.pdf');
        break;

      case 'docx':
        // For DOCX, we'll use a simple text download for now
        // In a production app, you'd want to use a proper DOCX generator
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
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="txt">TXT</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>
          <button
            onClick={downloadResults}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Download
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {results.map((category) => (
          <div
            key={category.category}
            className="rounded-lg bg-white p-6 shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {category.category}
            </h3>
            <div className="mt-4 space-y-6">
              {category.answers.map((qa, idx) => (
                <div key={idx} className="border-t border-gray-200 pt-4">
                  <p className="font-medium text-gray-900">Q: {qa.question}</p>
                  <p className="mt-2 text-gray-600">A: {qa.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}