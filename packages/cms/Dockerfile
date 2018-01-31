FROM rwoody/ht-api-base

RUN mkdir /app
WORKDIR /app

ARG NPM_TOKEN

COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
RUN npm install --production
RUN rm -f /app/.npmrc
COPY dist/ /app/dist

EXPOSE 3000
CMD npm start