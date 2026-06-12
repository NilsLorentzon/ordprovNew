FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package files as root first
COPY package*.json ./

# Install dependencies as root
RUN npm install

# Copy everything else
COPY . .

# Switch to node user
# USER node

# Change ownership of app directory to node (UID 1000)
# RUN chown -R node:node /usr/src/app

# Switch to node user (UID 1000)
# USER node

EXPOSE 3000

CMD ["npm", "run", "build"]
