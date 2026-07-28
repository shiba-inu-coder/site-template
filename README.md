# mafia-casinode.de — public site

Standalone Nuxt 4 (SSR) public casino affiliate site. Content is read from a shared MongoDB
managed by a separate admin service. This app is read-only towards the DB and is meant to be
reused as a template for other affiliate sites.

## Setup

```bash
npm install        # requires legacy-peer-deps (set in .npmrc)
cp .env.example .env   # fill in real values
npm run dev        # http://localhost:3000
```

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build (includes vue-tsc type check)
npm run preview    # preview production build
npm run lint       # eslint + prettier --write
npm run lintfix    # eslint --fix + prettier
```

## Cache purge API

Post/settings responses are cached on disk (Nitro `fsApp` storage, 1 year TTL). The admin
service must purge the cache after content changes:

```
POST /api/v1/system/cache/purge
Header: x-cache-purge-secret: <CACHE_PURGE_SECRET>
Body:   {"target":"post","slug":"<post-slug>"} | {"target":"settings"} | {"target":"all"}
```

Returns `200 {ok, purged}`; `401` on bad/missing secret (endpoint is disabled if the env
var is unset); `400` on invalid body.

## Deploy

Manual GitHub Actions workflows (`workflow_dispatch`) build a Docker image (secrets from
HashiCorp Vault) and deploy to a VPS with Docker Swarm. `CACHE_PURGE_SECRET` is not baked
into the image — pass `NUXT_CACHE_PURGE_SECRET` as a runtime env variable to the service.
