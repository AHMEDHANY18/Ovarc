-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreBook" (
    "storeId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "copies" INTEGER NOT NULL DEFAULT 1,
    "soldout" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StoreBook_pkey" PRIMARY KEY ("storeId","bookId")
);

-- AddForeignKey
ALTER TABLE "StoreBook" ADD CONSTRAINT "StoreBook_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreBook" ADD CONSTRAINT "StoreBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
