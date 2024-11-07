FROM node:20-alpine AS build
ARG VERSION
ENV VERSION ${VERSION}

RUN npm install -g pnpm
WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine AS serve
ARG VERSION
LABEL org.opencontainers.image.source https://github.com/KennethWussmann/caption.now

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
ENV VITE_APP_VERSION ${VERSION}
CMD ["nginx", "-g", "daemon off;"]
