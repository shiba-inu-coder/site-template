# Публичный сайт. Собирается в GitHub Actions, живёт в swarm на VPS
# (репозиторий deploy-template генерирует его compose-файл).
#
# Секретов и конфигурации в образе нет: ни адреса Mongo, ни домена. Всё, что
# в runtimeConfig, контейнер забирает из Vault на старте — см. entrypoint.mjs.

# 1) Зависимости целиком — dev нужны для сборки
FROM node:22.23.2-slim AS dependencies
WORKDIR /var/www/app
# .npmrc здесь не для удобства: в нём legacy-peer-deps, без которого npm ci
# упадёт на конфликте peer-зависимостей, и подмена vite на rolldown-vite.
COPY package.json package-lock.json .npmrc ./
# --ignore-scripts выключил бы postinstall (`nuxt prepare`), а без него нет
# .nuxt/tsconfig и алиасов — сборка упадёт на первом же импорте `#sg`.
# Кеш npm здесь не чистится: в образ этот слой не попадает, из него забирают
# только node_modules. Чистка нужна там, где слой уезжает в реестр, — в runner.
RUN npm ci

# 2) Сборка
FROM node:22.23.2-slim AS builder
WORKDIR /var/www/app
COPY --from=dependencies /var/www/app/node_modules ./node_modules
COPY . ./

# Ни одного build-аргумента: адрес сайта, имя базы и строка подключения
# подставляются на старте контейнера. Единственное, что остаётся зашитым, —
# имя облака Cloudinary (shared/constants/base.ts): @nuxt/image печёт baseURL
# провайдера в сборку, в runtimeConfig от него уезжает только ipx.
ENV NODE_ENV=production

RUN npm run build

# 3) Runtime — только production-зависимости
FROM node:22.23.2-slim AS runner
WORKDIR /var/www/app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /var/www/app/.output ./.output
# Рядом с .output, а не в подкаталоге: точка входа импортирует сервер
# относительным путём ./.output/server/index.mjs.
COPY --from=builder /var/www/app/docker/*.mjs ./

ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000

EXPOSE 3000

# Запускается не сервер, а загрузчик: он забирает конфигурацию из Vault и
# кладёт её в окружение до того, как Nitro соберёт runtimeConfig.
CMD ["node", "entrypoint.mjs"]
