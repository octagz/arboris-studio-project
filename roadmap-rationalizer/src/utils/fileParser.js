/**
 * Parses PDF files and extracts text content using PDF.js
 * @param {File} file - PDF file object
 * @returns {Promise<string>} - Extracted text content
 */
async function parsePDFFile(file) {
  const pdfjsLib = await import('pdfjs-dist');
  
  // Configure PDF.js to use the worker from CDN
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      resolve(fullText.trim());
    } catch (error) {
      reject(new Error(`Failed to parse PDF: ${error.message}`));
    }
  });
}

/**
 * Parses various file types and extracts text content
 * @param {File} file - File object to parse
 * @returns {Promise<string>} - Extracted text content
 */
export async function parseFileContent(file) {
  // Check if the file is a PDF
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return await parsePDFFile(file);
  }

  // Handle other file types
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.onerror = (e) => {
      reject(new Error('Failed to read file'));
    };

    // Read text files
    if (file.type.startsWith('text/') || 
        file.type === 'application/json' ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      // For other file types, try to read as text anyway
      reader.readAsText(file);
    }
  });
}

/**
 * Combines multiple file contents into a single context string
 * @param {Array<File>} files - Array of files
 * @returns {Promise<string>} - Combined content
 */
export async function combineFileContents(files) {
  const contents = await Promise.all(
    files.map(async (file) => {
      try {
        const content = await parseFileContent(file);
        return `--- File: ${file.name} ---\n${content}\n\n`;
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
        return `--- File: ${file.name} ---\n(Error reading file)\n\n`;
      }
    })
  );

  return contents.join('');
}

/**
 * Formats a data structure for export
 * @param {Object} data - Data to format
 * @returns {string} - Formatted string
 */
export function formatDataForExport(data) {
  if (typeof data === 'string') {
    return data;
  }
  return JSON.stringify(data, null, 2);
}

