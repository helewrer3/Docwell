FROM node:lts AS development

WORKDIR /code

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

RUN npm ci

RUN npm install -g serve

COPY . /code

EXPOSE 3000

RUN chmod +x init.sh

CMD [ "/code/init.sh" ]