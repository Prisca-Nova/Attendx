FROM node:20

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Clear npm cache, remove any existing node_modules, and install dependencies
RUN npm cache clean --force && \
    rm -rf node_modules && \
    npm install

# Copy the rest of the application
COPY . .

# Build the application, install production dependencies only, and install PM2 globally
RUN npm run build && \
    rm -rf node_modules && \
    npm ci --only=production && \
    npm install pm2 -g

# Expose the port your app runs on
EXPOSE 8080

# Start the application using PM2 and the ecosystem config
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "development"]