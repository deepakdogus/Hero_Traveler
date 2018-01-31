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
COPY .babelrc /app/.babelrc
RUN npm run build
RUN rm -rf /app/src
RUN rm -rf /app/.babelrc
COPY src/public/favicon.ico /app/dist/public/favicon.ico
COPY src/templates /app/dist/templates

EXPOSE 3002
CMD npm start
