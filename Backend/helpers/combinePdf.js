const {PDFDocument} = require('pdf-lib');

// Function to merge PDFs
async function mergePdfs(pdfs) {
  const mergedPdfDoc = await PDFDocument.create();
  for (const pdfBytes of pdfs) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdfDoc.addPage(page));
  }
  return await mergedPdfDoc.save();
}

module.exports = mergePdfs;