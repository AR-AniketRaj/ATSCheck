const fs = require("fs");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.mjs");

const extractPdfText = async (filePath) => {
  const pdfBuffer = fs.readFileSync(filePath);

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    disableWorker: true,
  });

  const pdfDocument = await loadingTask.promise;

  let resumeText = "";

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
    const page = await pdfDocument.getPage(pageNumber);

    const textContent = await page.getTextContent();

    const pageText = textContent.items.map((item) => item.str).join(" ");

    resumeText += pageText + "\n";
  }

  return resumeText;
};

module.exports = {
  extractPdfText,
};
