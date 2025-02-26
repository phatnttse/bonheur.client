# Use node image as the build environment
FROM node:20-alpine3.17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (Dockerfile cùng cấp với package.json)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Install Angular CLI (nếu chưa cài trong package.json)
RUN npm install -g @angular/cli

# Copy the rest of the application's source code
COPY . .

# Build the Angular application
RUN npm run build --configuration=production

# Use nginx:alpine as the runtime image
FROM nginx:alpine

# Sao chép file cấu hình Nginx vào container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular application to the nginx html directory
COPY --from=builder /app/dist/bonheur.client/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 4300

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
