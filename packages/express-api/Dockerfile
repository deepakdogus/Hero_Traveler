FROM rwoody/ht-api-base

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir /app
WORKDIR /app

ARG NPM_TOKEN

COPY yarn.lock /app/yarn.lock
COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
RUN $HOME/.yarn/bin/yarn install
RUN rm -f /app/.npmrc
COPY index.js /app/index.js
COPY dist/ /app/dist
COPY certificates/ /app/certificates

EXPOSE 3000
CMD npm start
