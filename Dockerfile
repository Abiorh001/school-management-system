# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app




# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean

# Copy only the frontend directory into the container
COPY . /app

# Install project dependencies
RUN npm install

