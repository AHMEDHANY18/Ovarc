import { prisma } from '../config/prisma';

interface InventoryRow {
  storeName: string;
  storeAddress: string;
  logo?: string;
  bookName: string;
  pages: number;
  authorName: string;
  price: number;
}

const upsertInventoryRow = async (row: InventoryRow) => {
  await prisma.$transaction(async (tx) => {
    const store = await tx.store.upsert({
      where: { name: row.storeName },
      update: {},
      create: {
        name: row.storeName,
        address: row.storeAddress,
        logo: row.logo,
      },
    });

    const author = await tx.author.upsert({
      where: { name: row.authorName },
      update: {},
      create: { name: row.authorName },
    });

    const book = await tx.book.upsert({
      where: {
        name_authorId: {
          name: row.bookName,
          authorId: author.id,
        },
      },
      update: {},
      create: {
        name: row.bookName,
        pages: row.pages,
        authorId: author.id,
      },
    });

    await tx.storeBook.upsert({
      where: {
        storeId_bookId: {
          storeId: store.id,
          bookId: book.id,
        },
      },
      update: {
        copies: { increment: 1 },
      },
      create: {
        storeId: store.id,
        bookId: book.id,
        price: row.price,
        copies: 1,
      },
    });
  });
};

export const inventoryRepository = {
  upsertInventoryRow,
};
