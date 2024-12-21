FROM python:3.11.6-slim-bullseye

# install build-essential and pkg-config for installing python packages
# Install build-essential and libpq-dev for psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /school_management_system               

# copy the requirements file
COPY ./requirements.txt /school_management_system/requirements.txt

# Install the dependencies
RUN pip install -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY . /school_management_system

# set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
