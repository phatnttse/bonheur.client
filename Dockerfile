# Use node image as the build environment
FROM node:20-alpine3.17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (Dockerfile cùng cấp với package.json)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production --legacy-peer-deps

# Copy the rest of the application's source code
COPY . ./

# Build the Angular application
RUN npm run build --prod

# Use nginx:alpine as the runtime image
FROM nginx:alpine

# Copy the built Angular application to the nginx html directory
COPY --from=builder /app/dist/bonheur-client /usr/share/nginx/html

# Expose port 80 and 443
EXPOSE  4200

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


#docker build -t nature-harvest-client:1.0.4 -f ./DockerfileAngular .
#docker login
#create phatnttse1923/nature-harvest-client:1.0.4 repository on DockerHub
#docker tag nature-harvest-client:1.0.4 phatnttse1923/nature-harvest-client:1.0.4
#docker push phatnttse1923/nature-harvest-client:1.0.4