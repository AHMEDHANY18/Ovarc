# 1. Base image
FROM node:20-alpine

# 2. Create app directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Generate Prisma Client
RUN npx prisma generate

# 7. Expose port
EXPOSE 4000

# 8. Run app
CMD ["npm", "run", "dev"]
