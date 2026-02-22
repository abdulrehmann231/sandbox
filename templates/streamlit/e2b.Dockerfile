# Use Python 3.10 as the base image
FROM python:3.10

RUN apt-get update && apt-get install -y git curl ripgrep fzf && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
RUN npm install -g opencode-ai@1.1.35 @anthropic-ai/claude-code@2.1.19

# Ensure the /home/user/project directory exists
RUN mkdir -p /home/user/project

# Set the working directory
WORKDIR /home/user/project

# Copy everything from the current directory into /home/user/project
COPY . .

# Create a virtual environment for Python packages
RUN python3 -m venv venv

# Activate the virtual environment and install Streamlit dependencies
RUN ./venv/bin/pip install --no-cache-dir -r requirements.txt