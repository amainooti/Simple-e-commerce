# Start of the multi-stage build
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Ensure writable permissions on the /app directory using root
USER root
RUN chmod -R 777 /app

# Clear npm cache and install dependencies
RUN npm cache clean --force && npm install

# Copy the rest of the application files
COPY . /app/

# Use root to create the dist directory and set permissions
RUN mkdir -p /app/dist && chmod -R 777 /app/dist

# Switch to 'node' user to build the application
USER node
RUN npm run build

# Use a lighter Node.js runtime image to run the application
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy only the built application files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy other necessary files
COPY package*.json ./
COPY .env.example .env

# Install only production dependencies
RUN npm install --only=production

# Create a non-root user and switch to it
RUN adduser -D node-user
USER node-user

# Expose the app port (assuming it's 3000)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]
