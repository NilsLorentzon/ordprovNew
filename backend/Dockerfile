FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Fix permissions so node user can access the directory
RUN chown -R node:node /usr/src/app
# RUN find /usr/src/app -mindepth 1 -not -path "/usr/src/app/data*" -exec chown -R node:node {} +

# Switch to node user

# Expose the port your app listens on
EXPOSE 3000
RUN ["npx", "tsc"]

USER node
# Start the application
CMD [ "npm", "run", "start" ]
