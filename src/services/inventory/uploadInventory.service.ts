import fs from 'fs';
import csv from 'csv-parser';
import { promises as fsp } from 'fs';
import { inventoryRepository } from '../../repositories/inventory.repository';

export const uploadInventoryService = async (file: Express.Multer.File) => {
  let processed = 0;
  let failed = 0;

  const MAX_ROWS = 500; // 🔥 مهم جدًا (حماية من timeout)

  const stream = fs.createReadStream(file.path).pipe(csv());

  await new Promise<void>((resolve, reject) => {
    stream.on('data', async (row) => {
      if (processed >= MAX_ROWS) {
        stream.destroy(); // وقف القراءة
        return;
      }

      stream.pause();
      try {
        const pages = Number(row.pages);
        const price = Number(row.price);

        if (
          !row.store_name ||
          !row.book_name ||
          !row.author_name ||
          Number.isNaN(pages) ||
          Number.isNaN(price)
        ) {
          failed++;
          stream.resume();
          return;
        }

        await inventoryRepository.upsertInventoryRow({
          storeName: row.store_name,
          storeAddress: row.store_address,
          logo: row.logo,
          bookName: row.book_name,
          pages,
          authorName: row.author_name,
          price,
        });

        processed++;
      } catch (err) {
        failed++;
        console.error('Row failed:', err);
      } finally {
        stream.resume();
      }
    });

    stream.on('end', resolve);
    stream.on('error', reject);
  });

  // 🧹 cleanup
  await fsp.unlink(file.path).catch(() => {});

  return {
    processedRows: processed,
    failedRows: failed,
    maxRows: MAX_ROWS,
  };
};
