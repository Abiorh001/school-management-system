# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the frontend directory into the container
COPY . /app

# Install project dependencies
RUN npm install

