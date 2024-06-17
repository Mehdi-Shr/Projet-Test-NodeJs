FROM node:20.14.0

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

RUN npm install

EXPOSE 3333
CMD [ "npm", "start" ]
