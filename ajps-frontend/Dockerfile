# Multi-stage build for Angular application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application for Docker
RUN npm run build:docker

# List contents to debug
RUN echo "=== Checking build output ===" && \
    ls -la /app/dist/ && \
    echo "=== Contents of ajps-frontend directory ===" && \
    ls -la /app/dist/ajps-frontend/ || echo "ajps-frontend directory not found"

# Production stage with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist/ajps-frontend/browser/ /usr/share/nginx/html/

# Debug: List what was copied
RUN echo "=== Contents of nginx html directory ===" && \
    ls -la /usr/share/nginx/html/

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Create nginx log directory and set permissions
RUN mkdir -p /var/log/nginx && \
    chmod 755 /var/log/nginx

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
