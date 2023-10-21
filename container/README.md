Dockerfile.base for Task Manager Application
This Dockerfile provides the configuration to containerize the Task Manager application using Node.js.

Prerequisites
Docker (https://www.docker.com/products/docker-desktop/) installed on your machine.

Overview of the Dockerfile
Base Image: The official Node.js runtime is used as the base image to ensure the application runs in a consistent environment.
Working Directory: Sets /usr/src/app inside the container as the working directory. All commands following the WORKDIR instruction will be run in this directory.
Dependencies Installation: Before running the application, its dependencies are installed. The application's package.json and package-lock.json are copied to the working directory, and npm install is executed.
Application Code: After installing the dependencies, the rest of the application code is copied to the working directory.
Starting the Application: By default, the application is started using the npm start command when the container is run.

Building the Docker Container
Navigate to the directory containing the Dockerfile.base.

Build the Docker image:

docker build -t task-manager -f Dockerfile ..

After the build completes, you can check that the image was created using:
docker images

Running the Docker Container
To run the application inside a Docker container:

docker run -p 5000:5000 task-manager
This assumes that your application runs on port 5000. Adjust the -p flag as necessary for your application's port.

Open a web browser and navigate to http://localhost:5000 to access the application.