# Кастомная вёрстка: папка `brand/`

Результат спайка. Контракт, на который опираются этапы 2a (поддержка в шаблоне) и 3 (агент).

## Контракт

| Файл | Роль |
|---|---|
| `brand/Header.vue`, `Footer.vue`, `Hero.vue` | подменяют стандартные части; нет файла — стандартная часть |
| `brand/styles.css` | подключается в сборку, если файл есть |
| `brand/blocks/<Key>.vue` | свой блок вместо общего (этап 2a) |
| `brand/theme.json`, `brand/site.json` | тема и тексты поверх `settings` (этап 2a) |

Обновление шаблона `brand/` не трогает. Статьи, SEO, schema.org, хлебные крошки, правила картинок, `/go/` и кеш из `brand/` не переопределяются.

## Подтверждено спайком

| Пункт | Итог |
|---|---|
| Опциональный glob | `import.meta.glob("~~/brand/*.vue", { eager: true })` в `app/utils/brand.ts`. Без папки — пустой объект, сборка зелёная. Голый `/brand/…` у Nuxt ничего не находит — только алиас `~~`. Ключи приходят как `../brand/X.vue`, поэтому поиск по суффиксу |
| Своя шапка в бандле | фикстура попадает в серверный бандл `layouts/default`. SSR на живой странице не проверен: в базе из `.env` нет постов |
| Tailwind и стили | `./brand/**/*.vue` в `content`; `css: [brand/styles.css]` в `nuxt.config.ts` только при наличии файла, в серверные стили попадает |
| Фикстура | `tests/fixtures/brand-sample/`; сборка с ней — `cp -r tests/fixtures/brand-sample brand && npm run build` |
| Draft-тег на staging | `buildStagingImage` в `appspro/shared/utils/staging-slots.js` зашивает `:latest`. Правка: необязательный параметр тега, один вызов в `staging-jobs.js` и тест. `main-server` не меняется — образ слота задаётся переменной `SITEn_IMAGE` |

## Не проверено

- Побайтное совпадение SSR у сайта без `brand/` — нужна страница с контентом (этап 2a).
- Гидрация кастомной шапки в браузере.
- Совместимость `brand/styles.css` с `theme-css-layers.test.ts`.
