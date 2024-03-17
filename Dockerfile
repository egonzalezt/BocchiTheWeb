# Stage 1: Build the React application
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire application
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the built React application with nginx
FROM nginx:1.25.4

# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static resources
RUN rm -rf ./*

# Copy the built React application from the builder stage
COPY --from=builder /app/build .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set the default command to start nginx and serve the application
CMD ["nginx", "-g", "daemon off;"]
