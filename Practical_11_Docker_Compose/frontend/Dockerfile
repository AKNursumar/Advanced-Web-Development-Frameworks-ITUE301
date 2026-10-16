# Multi-stage or build & preview Dockerfile for React frontend
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./
RUN npm install

# Copy source code and build Vite production bundle
COPY . .
RUN npm run build

# Expose Vite preview port
EXPOSE 5173

# Serve production preview accessible from outside the container
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
