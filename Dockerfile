# 课程网站部署（Railway）：Node 构建 VitePress 静态站 → Caddy 托管
FROM node:22-slim AS build
WORKDIR /app
COPY site/package.json site/package-lock.json site/
RUN cd site && npm ci
COPY site site
# 构建时 sync-demos 会从这里复制模板 demo
COPY studio/templates studio/templates
RUN cd site && npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/site/docs/.vitepress/dist /srv
