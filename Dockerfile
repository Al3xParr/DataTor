# Use the latest LTS version of Node.js
FROM node:18-alpine
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy the rest of your application files
COPY . .
 
# Expose the port your app runs on
EXPOSE 8080
 

RUN ["npm", "run", "build"]
CMD ["npm", "start"]
# CMD ["npm", "run", "start"]
# CMD ["npm", "start"]