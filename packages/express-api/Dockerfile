#FROM rehashstudio2017/ht-api-base
FROM node:7.7.2
#ARG NPM_TOKEN
RUN mkdir /app
WORKDIR /app

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

COPY . /app
#RUN rm -f /app/.env
RUN $HOME/.yarn/bin/yarn install
#RUN rm -f /app/.npmrc
RUN npm run build

EXPOSE 3000
CMD npm start
