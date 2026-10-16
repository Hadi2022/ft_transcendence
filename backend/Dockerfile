FROM node:26-trixie

WORKDIR /app

COPY package-lock.json ./
COPY package.json ./

RUN npm ci

COPY . .

# RUN npx prisma generate

CMD ["node", "./src/index.ts"]