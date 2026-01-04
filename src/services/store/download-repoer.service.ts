import PDFDocument from 'pdfkit';
import { storeReportRepository } from '../../repositories/store-report.repository';

export const generateStoreReportService = async (storeId: string) => {
  const store = await storeReportRepository.getStoreById(storeId);
  if (!store) {
    throw new Error('Store not found');
  }

  const topBooks = await storeReportRepository.getTopPriciestBooks(storeId);
  const topAuthors = await storeReportRepository.getTopAuthors(storeId);

  const doc = new PDFDocument();
  const chunks: Buffer[] = [];

  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  doc.on('end', () => {});

  // Title
  doc.fontSize(20).text(store.name, { align: 'center' });
  doc.moveDown();

  // Logo (optional)
  if (store.logo) {
    try {
      doc.image(store.logo, { width: 100, align: 'center' });
      doc.moveDown();
    } catch {
      // ignore image errors
    }
  }

  // Top Books
  doc.fontSize(16).text('Top 5 Priciest Books');
  doc.moveDown(0.5);

  topBooks.forEach((item, index) => {
    doc
      .fontSize(12)
      .text(`${index + 1}. ${item.book.name} - ${item.price} EGP`);
  });

  doc.moveDown();

  // Top Authors
  doc.fontSize(16).text('Top 5 Prolific Authors');
  doc.moveDown(0.5);

  topAuthors.forEach((item, index) => {
    doc
      .fontSize(12)
      .text(`${index + 1}. ${item.authorName} (${item.bookCount} books)`);
  });

  doc.end();

  const buffer = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  const today = new Date().toISOString().split('T')[0];
  const fileName = `${store.name}-Report-${today}.pdf`;

  return { buffer, fileName };
};
