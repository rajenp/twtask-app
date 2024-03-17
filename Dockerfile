FROM --platform=linux/amd64 node:21

ENV NODE_ENV=development
WORKDIR /twtaskapp

# Setup
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"],
RUN npm install -g npm@latest
RUN npm install -s 
COPY . .

# This is where generated test report will be served
EXPOSE 8100

RUN chown -R node /twtaskapp
USER node
ENTRYPOINT [ "npm" ]
CMD [ "start"]