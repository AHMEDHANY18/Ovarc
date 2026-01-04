# Ovarc Backend Coding Challenge — Digital Bookstore Inventory & Reporting

This repository contains my solution to the **Backend Coding Challenge**.
It implements a **CSV-based inventory upsert API** and a **PDF report generator** for a digital bookstore.

---

## Overview

The system supports:
1. Uploading a CSV file containing inventory records.
2. Upserting data into the database:
   - Create **Store**, **Author**, **Book** if they do not exist.
   - If the store already stocks the same book, **increment copies**.
3. Generating a **PDF report** for a given store including:
   - Store name and logo.
   - **Top 5 Priciest Books** (highest prices).
   - **Top 5 Prolific Authors** (highest number of available books in store inventory).

---

## Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma ORM** (Sequelize was preferred in the prompt; Prisma is used as an acceptable ORM alternative)
- **PostgreSQL**
- **pdfkit** (PDF generation)
- **multer** (file upload)
- **zod** (request validation)

---

## Features

### 1) Inventory Upload (CSV Upsert)
- Parses the uploaded CSV file and processes each row.
- Upserts:
  - `Store` by unique `name`
  - `Author` by unique `name`
  - `Book` by composite unique `(name, authorId)`
- Upserts `StoreBook` by composite `(storeId, bookId)`:
  - If exists → `copies += 1`
  - Else → create with `copies = 1`

### 2) Store PDF Report
- Generates a PDF named:
  - **`[Store Name]-Report-YYYY-MM-DD.pdf`**
- Includes:
  - Store name
  - Store logo (best-effort; if the URL is invalid/unreachable, the report still generates)
  - Top 5 priciest books
  - Top 5 prolific authors

---

## Database Schema

Models follow the required structure:

- **store**
  - `id`, `name`, `address`, `logo`

- **author**
  - `id`, `name`

- **book**
  - `id`, `name`, `pages`, `authorId`

- **store_book**
  - `storeId`, `bookId`, `price`, `copies`, `soldout`

Notes:
- `Store.name` is **unique**
- `Author.name` is **unique**
- `Book` is unique by **(name, authorId)**
- `StoreBook` uses a composite key **(storeId, bookId)**

---

## API Endpoints

### 1) Upload Inventory CSV
**POST** `/api/v1/inventory/upload`

- **Content-Type:** `multipart/form-data`
- **Body:** `file` (CSV file)

**Success Response**
```json
{
  "message": "Inventory uploaded successfully",
  "data": {
    "processedRows": 3,
    "failedRows": 0,
    "maxRows": 500
  }
}

````

---

### 2) Download Store PDF Report

**GET** `/api/v1/store/:id/download-report`

* Returns a PDF file with:

  * `Content-Type: application/pdf`
  * `Content-Disposition: attachment; filename="..."`

---

## CSV Format

CSV must contain the following columns:

```csv
store_name,store_address,book_name,pages,author_name,price,logo
```

Example:

```csv
store_name,store_address,book_name,pages,author_name,price,logo
Cairo Store,Nasr City,Node.js Basics,250,Ahmed Ali,150,http://logo.com/logo.png
Cairo Store,Nasr City,Advanced Node.js,300,Ahmed Ali,200,http://logo.com/logo.png
Alex Store,Smouha,Express Guide,180,Mohamed Hassan,120,http://logo.com/logo2.png
```

---

## Validation & Error Handling

* **Request validation** using `zod` (file is required).
* **Multer errors** handled globally:

  * Returns `413` if file exceeds configured size limit.
* **CSV row validation**:

  * Invalid rows are counted as `failedRows` and skipped.
* **Robust error handling** with proper HTTP status codes and server-side logging.

### Performance Safety

To avoid long-running requests with extremely large CSV files:

* CSV is processed using streaming (row-by-row).
* A cap is applied:

  * `MAX_ROWS = 500` per request (configurable).

---

## Local Setup (Recommended)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"
PORT=4000
NODE_ENV=development
```

### 3) Run database migrations

```bash
npx prisma migrate dev
```

### 4) Start the server

```bash
npm run dev
```

Server will run on:

```
http://localhost:4000
```

---

## Testing with Postman

### Upload CSV

* `POST http://localhost:4000/api/v1/inventory/upload`
* Body → form-data:

  * `file`: (choose CSV file)

### Download PDF Report

* `GET http://localhost:4000/api/v1/store/{STORE_ID}/download-report`

To get `STORE_ID`, you can use:

```bash
npx prisma studio
```

---

## Docker (Nice to have)

A Docker setup (Dockerfile + docker-compose) can be included as a convenience for local development.

```bash
docker compose up --build
```

Then run migrations inside the backend container:

```bash
docker exec -it minly-backend npx prisma migrate dev
```

> Note: Docker is included as a convenience; the core solution is fully runnable locally without Docker.

---

## Project Structure

```
src/
  config/
  controllers/
  dtos/
  middleware/
  repositories/
  routes/
  services/
  server.ts
```

---

## Time Spent

**Actual time spent:** **1:13:24** (HH:MM:SS)

```
```
