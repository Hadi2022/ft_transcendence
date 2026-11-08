FROM node:24-alpine AS frontend-builder
WORKDIR /app

COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/

WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY shared/ ./shared/
COPY frontend/ ./frontend

WORKDIR /app/frontend
RUN npm ci

WORKDIR /app/frontend
COPY shared/ ./shared/
COPY frontend/ ./frontend/

RUN npm run build

FROM nginx:1.31.7-trixie


RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 \
        -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/server.key \
        -out /etc/nginx/ssl/server.crt \
        -subj "/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" && \
    chmod 600 /etc/nginx/ssl/server.key && \
    rm -rf /var/lib/apt/lists/*

COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/templates/default.conf.template

CMD ["nginx", "-g", "daemon off;"]
