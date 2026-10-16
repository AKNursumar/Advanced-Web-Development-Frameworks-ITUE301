# Production-ready Node.js container for Express backend
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Run the Express server
CMD ["node", "server.js"]
