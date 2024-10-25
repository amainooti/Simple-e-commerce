# Start of the multi-stage build
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Ensure writable permissions on the /app directory
USER root
RUN chmod -R 777 /app

# Clear npm cache and install dependencies
RUN npm cache clean --force && npm install

# Copy prisma schema
COPY prisma ./prisma/

# Copy all application files including .env
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create necessary directories and set permissions
RUN mkdir -p /app/dist /app/uploads && chmod -R 777 /app/dist /app/uploads

# Build the application
RUN npm run build

# Start new stage for production
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy environment files
COPY .env* ./

# Copy prisma files and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Install only production dependencies
RUN npm install --only=production

# Generate Prisma client in production environment
RUN npx prisma generate

# Create a non-root user and switch to it
RUN adduser -D node-user
USER node-user

# Expose the app port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]