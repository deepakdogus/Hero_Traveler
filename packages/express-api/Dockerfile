FROM rehashstudio2017/ht-api-base
ARG NPM_TOKEN
RUN mkdir /app
WORKDIR /app

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

COPY . /app
RUN $HOME/.yarn/bin/yarn install
RUN rm -f /app/.npmrc
RUN npm run build

EXPOSE 3000
CMD npm start
