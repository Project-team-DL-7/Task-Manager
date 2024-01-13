# Dockerfile.base for Task Manager Application
This Dockerfile provides the configuration to containerize the Task Manager application using Node.js.

## Prerequisites
Docker (https://www.docker.com/products/docker-desktop/) installed on your machine.

## Overview of the Dockerfile
- Base Image: The official Node.js runtime is used as the base image to ensure the application runs in a consistent environment.
- Working Directory: Sets /usr/src/app inside the container as the working directory. All commands following the WORKDIR instruction will be run in this directory.
- Dependencies Installation: Before running the application, its dependencies are installed. The application's package.json and package-lock.json are copied to the working directory, and npm install is executed.
- Application Code: After installing the dependencies, the rest of the application code is copied to the working directory.
- Starting the Application: By default, the application is started using the npm start command when the container is run.

## Building the Docker Container

Manually copy .env.example to .env or if on linux/mac:
```bash
$ cp .env.example .env
```
### Running the Docker Container
#### Powershell:
    docker-compose up --build

## Free used port
#### Powershell:

    Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
### Example response
#### Powershell:

    [22ada@Task-Manager] (main)
    $ Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

    Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
    -------  ------    -----      -----     ------     --  -- -----------
        965      42    67204      86040      20.14  18076   6 com.docker.bac...
        138      10     1504       7676       0.00  17044   6 wslrelay

### Kill com.docker.bac - by its Id
#### Powershell:

    Stop-Process -Id 18706 -Force


## Deploying to production

1. Setup gcloud cli

See official google cloud documentation.

2. Build docker image

```
docker build --file Dockerfile.prod . --tag task-manager-prod
```

3. Tag the image

```
docker tag task-manager-prod europe-west3-docker.pkg.dev/uu-task-manager/task-manager-app/task-manager-app
```

4. Push docker image to GCP artifact registry

```
docker push europe-west3-docker.pkg.dev/uu-task-manager/task-manager-app/task-manager-app
```

5. Run docker image in compute engine. Don't forget to specify environment variables.

