FROM node:18-alpine

# Install python/pip, required by some npm dependencies
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Install firebase cli, needed by the project in general
RUN yarn global add firebase-tools

# Install cli tools, needed for docker-dev.sh
RUN yarn global add ts-watch serve

# Install java, required by some npm dependencies
RUN apk add openjdk17-jre-headless

# Install gcloud cli, useful if ever needed
RUN PACKAGE_NAME=google-cloud-cli-452.0.0-linux-arm.tar.gz &&\
    wget "https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/$PACKAGE_NAME" &&\
    tar -xf $PACKAGE_NAME &&\
    ./google-cloud-sdk/install.sh --quiet &&\
    rm $PACKAGE_NAME
