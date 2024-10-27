FROM node:20-alpine AS build

RUN npm install -g pnpm
WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine AS serve
LABEL org.opencontainers.image.source https://github.com/KennethWussmann/caption.now

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
