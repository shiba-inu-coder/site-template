# 1) Install all dependencies (prod + dev)
FROM node:22.15.0-slim AS dependencies
WORKDIR /var/www/app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

# 2) Build the application
FROM node:22.15.0-slim AS builder
WORKDIR /var/www/app
COPY . ./
COPY --from=dependencies /var/www/app/node_modules ./node_modules

# Build-time arguments
ARG mongo_uri
ARG cloudinary_cloud_name
ARG docker_hub_tag
ARG canonical_domain
ARG db_name
ARG domain_name
ARG site_url

# Environment variables for Nuxt build
# CACHE_PURGE_SECRET is NOT baked into the image:
# pass NUXT_CACHE_PURGE_SECRET as a runtime env variable instead.
ENV MONGO_URI=${mongo_uri} \
    CLOUDINARY_CLOUD_NAME=${cloudinary_cloud_name} \
    NODE_ENV=production \
    DOCKER_HUB_TAG=${docker_hub_tag} \
    CANONICAL_DOMAIN=${canonical_domain} \
    DB_NAME=${db_name} \
    DOMAIN_NAME=${domain_name} \
    SITE_URL=${site_url}

RUN npm run build

# 3) Runtime: only production dependencies
FROM node:22.15.0-slim AS runner
WORKDIR /var/www/app
COPY package.json package-lock.json ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy built output
COPY --from=builder /var/www/app/.output ./.output

CMD ["node", ".output/server/index.mjs"]
