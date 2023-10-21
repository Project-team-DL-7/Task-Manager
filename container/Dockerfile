# Use the official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from your project's root to the working directory
COPY ../package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY .. .

# Expose port 5000 for the application
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
