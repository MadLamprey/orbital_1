# Use an official Python runtime as the base image
FROM python:3.9

# Set the working directory in the container
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

# Copy the requirements file to the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask app code to the container
COPY . .

ENV PORT 8080

# Set the entrypoint command for the container
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app
