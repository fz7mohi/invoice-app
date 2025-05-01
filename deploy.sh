#!/bin/bash

# Stop any existing PM2 processes
pm2 stop all

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Display logs
pm2 logs 