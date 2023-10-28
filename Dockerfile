# Use the official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from your project's root to the working directory
COPY package*.json ./

# Install the application dependencies, including nodemon for development
RUN npm install
RUN npm install -g nodemon
RUN npm install swagger-jsdoc swagger-ui-express --save

# Expose port 5000 for the application
EXPOSE 5000

# Start the application using nodemon
CMD ["nodemon", "index.js"]
