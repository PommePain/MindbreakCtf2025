FROM node:22.0-alpine

RUN apk add --update --no-cache sqlite bash curl openssl python3 nginx runuser
RUN ln -sf python3 /usr/bin/python

RUN addgroup -S seed_mng && \
    adduser -S -g seed_mng seed_mng && \
    mkdir -p /seed_spy/app && \
    chown -R seed_mng:seed_mng /seed_spy

WORKDIR /home/seed_mng/seed_spy/app
COPY packages /home/seed_mng/seed_spy/app/packages
COPY package.json /home/seed_mng/seed_spy/app/package.json
COPY ./flag.txt /home/seed_mng/seed_spy/app/flag.txt

EXPOSE 8000

RUN chown -R seed_mng:seed_mng /home/seed_mng
RUN rm -f /home/seed_mng/seed_spy/app/packages/backend/db.sqlite

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN cd /home/seed_mng/seed_spy/app && npm install

RUN npm -w packages/frontend run build

CMD ["sh", "-c", "nginx -g 'daemon on;' && runuser -u seed_mng -- npm run start"]
