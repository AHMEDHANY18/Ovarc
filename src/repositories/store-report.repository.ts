import { prisma } from '../config/prisma';

const getStoreById = (storeId: string) => {
  return prisma.store.findUnique({
    where: { id: storeId },
  });
};

const getTopPriciestBooks = (storeId: string) => {
  return prisma.storeBook.findMany({
    where: { storeId },
    orderBy: { price: 'desc' },
    take: 5,
    include: {
      book: true,
    },
  });
};

const getTopAuthors = async (storeId: string) => {
  const result = await prisma.storeBook.findMany({
    where: { storeId },
    select: {
      book: {
        select: {
          author: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const authorMap: Record<string, number> = {};

  result.forEach(({ book }) => {
    const authorName = book.author.name;
    authorMap[authorName] = (authorMap[authorName] || 0) + 1;
  });

  return Object.entries(authorMap)
    .map(([authorName, bookCount]) => ({ authorName, bookCount }))
    .sort((a, b) => b.bookCount - a.bookCount)
    .slice(0, 5);
};

export const storeReportRepository = {
  getStoreById,
  getTopPriciestBooks,
  getTopAuthors,
};
