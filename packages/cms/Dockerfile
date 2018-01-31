FROM rehashstudio2017/ht-api-base
ARG NPM_TOKEN
RUN mkdir /app
WORKDIR /app

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN $HOME/.yarn/bin/yarn install
RUN rm -f /app/.npmrc
COPY src/ /app/src
RUN npm run build
RUN rm -rf /app/src

EXPOSE 3000
CMD npm start
