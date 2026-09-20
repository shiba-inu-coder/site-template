/**
 * Демо-статья страницы `/ui` (5b) — единственный источник данных для
 * `app/pages/ui.vue`. Две части в одном `sections[]`:
 *
 * 1. «Живая статья» (первые семь секций) — один экземпляр каждого блока без
 *    своего `variant`, поэтому её вид целиком решает тема (`?preset=` или
 *    запись из базы). Это и есть библиотека UI сайта: то же самое дерево,
 *    что увидит настоящий читатель, под любым пресетом.
 * 2. «Библиотека вариантов» (секции `lib-*`) — по одной секции на шорткод, в
 *    каждой все его варианты сразу, с явным `variant` на маркере (побеждает
 *    и тему, и дефолт блока). Так видно все варианты одновременно, не
 *    переключая тему.
 *
 * Обновлять при каждом новом шорткоде или варианте — см. `docs/ui.md`,
 * «/ui page»: новый вариант, у которого нет строки в библиотеке ниже, —
 * вариант, который никто не проверит после правки темы.
 */

const WRITER = {
  fullName: "Ян Новак",
  position: "Редактор раздела «Казино»",
  info: "Тестирует казино на реальные депозиты, проверяет скорость выплат и поддержку.",
  avatar: { path: "sample", alt: "Ян Новак" },
  username: "jan-novak",
};

const LEAD_IMAGE = { path: "sample", alt: "Лобби GoldBet Casino" };

const REAL_TEXT = {
  h1: "GoldBet Casino: обзор, бонус 25 000 Kč и вывод за 24 часа",
  intro: [
    "GoldBet принимает игроков из Чехии с 2019 года и держит один из самых быстрых выводов на рынке — большинство заявок закрываются за 24 часа.",
    'Бонус выдаётся на первые три депозита, вейджер ×35 на бонусную часть. Фриспины начисляются пачками по 50 в день, <a href="#" class="app-link">полные условия</a> — в разделе платежей.',
  ],
  listTitle: "Как активировать бонус",
  list: [
    "Зарегистрироваться и подтвердить телефон",
    "Внести депозит от 500 Kč",
    "Активировать бонус в личном кабинете",
  ],
  offersLead:
    "Три оффера, которые в этом месяце отбивают вейджер быстрее остальных.",
  paymentsLead:
    "У карт и криптокошельков разные лимиты — проверьте их перед выбором метода.",
  verdictLead: "Коротко: если вывод важнее бонуса, GoldBet — разумный выбор.",
};

const LOREM_TEXT = {
  h1: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do",
  intro: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  ],
  listTitle: "Consectetur adipiscing elit sed do eiusmod",
  list: [
    "Lorem ipsum dolor sit amet consectetur",
    "Adipiscing elit sed do eiusmod tempor incididunt",
    "Ut labore et dolore magna aliqua ut enim",
  ],
  offersLead:
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  paymentsLead:
    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  verdictLead:
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.",
};

const FAQ_REAL: { label: string; value: string }[] = [
  {
    label: "Есть ли бонус без депозита?",
    value: "Да, 50 фриспинов за подтверждение телефона, вейджер ×30.",
  },
  {
    label: "Сколько идёт вывод?",
    value: "На карты — до 24 часов, на криптокошельки — до часа.",
  },
  {
    label: "Нужна ли верификация?",
    value: "Да, до первого вывода — паспорт и подтверждение адреса.",
  },
];

const FAQ_LOREM: { label: string; value: string }[] = [
  {
    label: "Lorem ipsum dolor sit amet?",
    value:
      "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    label: "Ut enim ad minim veniam?",
    value:
      "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    label: "Duis aute irure dolor?",
    value:
      "In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
  },
];

const marker = (
  name: string,
  attrs: Record<string, string | number | boolean> = {},
): string => {
  const attrString = Object.entries(attrs)
    .map(([key, value]) => ` ${key}="${String(value)}"`)
    .join("");

  return `<div class="shortcode" is="vue:${name}"${attrString}></div>`;
};

// Строка библиотеки вариантов: подпись варианта прямо в тексте, а не только
// по наведению — так видно все сразу и на скриншоте, не только вживую.
const variantRow = (variantLabel: string, markerHtml: string): string =>
  `<h3>вариант: ${variantLabel}</h3>${markerHtml}`;

const CASINO_OFFERS = [
  {
    key: "goldbet",
    name: "GoldBet",
    logo: "GOLDBET",
    score: "4.8",
    bonus: "100 % до 25 000 Kč",
    text: "50 вращений за регистрацию, вейджер ×30.",
    slug: "goldbet-casino",
  },
  {
    key: "boomerang",
    name: "Boomerang",
    logo: "BOOMERANG",
    score: "4.5",
    bonus: "200 % до 15 000 Kč",
    text: "Еженедельный кэшбэк 10 % в live-казино.",
    slug: "boomerang-casino",
  },
  {
    key: "rolling",
    name: "Rolling Slots",
    logo: "ROLLING",
    score: "4.2",
    bonus: "150 % + 100 FS",
    text: "8 уровней VIP-программы, менеджер с 5-го.",
    slug: "rolling-slots-casino",
  },
];

// grid-cards: все пять вариантов читают разные поля одного и того же набора
// офферов — item несёт весь список сразу, лишнее просто не отрисуется.
const buildGridCardItems = () =>
  CASINO_OFFERS.map((offer) => ({
    title: offer.name,
    text: offer.text,
    buttonText: "Играть",
    refLink: offer.slug,
    refLinkType: "casino" as const,
    logo: offer.logo,
    score: offer.score,
    bonus: offer.bonus,
    img: LEAD_IMAGE,
  }));

const buildGridCardsEntry = (uniqId: string, variant: string) => ({
  data: {
    uniqId,
    variant,
    refLink: "",
    refLinkType: "casino" as const,
    cardsPerRowDesktop: "3",
    imgHeight: "auto",
    imgWidth: "auto",
    imgRoundCorner: "0",
    data: buildGridCardItems(),
  },
});

const DATA_TABLE_COLUMNS = [
  { title: "Казино", name: "casino" },
  { title: "Бонус", name: "bonus" },
  { title: "Вейджер", name: "wager" },
  { title: "Вывод", name: "payout" },
];

const DATA_TABLE_ROWS = [
  {
    casino: "GoldBet",
    bonus: "100 % до 25 000 Kč",
    wager: "×35",
    payout: "24 ч",
  },
  {
    casino: "Boomerang",
    bonus: "200 % до 15 000 Kč",
    wager: "×40",
    payout: "48 ч",
  },
  {
    casino: "Rolling Slots",
    bonus: "150 % + 100 FS",
    wager: "×45",
    payout: "72 ч",
  },
];

const buildDataTableEntry = (uniqId: string, variant: string) => ({
  data: {
    uniqId,
    variant,
    density: "regular",
    head: "solid",
    striped: true,
    btnName: "Играть",
    refLink: "goldbet-casino",
    showTableHead: true,
    defaultCountRows: "10",
    columns: DATA_TABLE_COLUMNS,
    rows: DATA_TABLE_ROWS,
  },
});

const buildTextImageEntry = (
  uniqId: string,
  variant: string,
  text: string,
) => ({
  data: {
    uniqId,
    variant,
    text: `<p>${text}</p>`,
    img: LEAD_IMAGE,
    imgHint: "Лобби GoldBet: слоты, live-казино, промо",
    imgSide: "right" as const,
    imgMobileSide: "top" as const,
    imgColumn: "50" as const,
    imgRoundCorner: "0",
    buttonText: "",
    refLink: "",
  },
});

const PROS_LIST = ["Вывод за 24 часа", "3 800+ игр", "Чат 24/7 на чешском"];
const CONS_LIST = ["Вейджер ×35", "Нет PayPal"];

const buildProsConsEntry = (uniqId: string, variant: string) => ({
  data: {
    uniqId,
    variant,
    data: { prosList: PROS_LIST, consList: CONS_LIST },
  },
});

const buildBiographyEntry = () => ({
  data: {
    uniqId: "demo-author",
    variant: "",
    data: { writer: WRITER },
  },
});

const buildContrastTypographySection = () => ({
  uid: "tipografika",
  title: "Типографика",
  comment: "",
  children: [],
  layout: {
    width: "container" as const,
    bg: { token: "primary-200", hex: "", opacity: 100 },
    image: { path: "", alt: "", overlay: 0 },
    padding: { top: 40, right: 0, bottom: 40, left: 0 },
    margin: { top: 0, bottom: 0 },
    radius: 12,
  },
  body: [
    "<h2>Заголовок h2 — этот текст не виден: заголовок секции рисует H1/H2 сам</h2>",
    "<h3>Заголовок h3</h3>",
    "<h4>Заголовок h4</h4>",
    "<h5>Заголовок h5</h5>",
    "<h6>Заголовок h6</h6>",
    '<p>Обычный абзац с <a href="#" class="app-link">внутренней ссылкой</a> и <strong>полужирным</strong> словом — маркеры списков и ссылка красятся токенами темы, а не фиксированным цветом.</p>',
    "<ul><li>Маркированный пункт первый</li><li>Маркированный пункт второй</li><li>Маркированный пункт третий</li></ul>",
    '<div class="article-img article-img--right article-img--w50"><img src="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/sample" alt="Легаси-картинка из старой статьи"></div>',
    "<p>Легаси-картинка выше вставлена напрямую в HTML тела секции (плавающий <code>figure</code> из старого редактора), а не шорткодом — так выглядели статьи до блока «Картинка + текст».</p>",
  ].join(""),
  blocks: [],
});

const buildLibrarySection = (params: {
  uid: string;
  title: string;
  body: string;
}) => ({
  uid: params.uid,
  title: params.title,
  comment: "",
  children: [],
  layout: {
    width: "container" as const,
    bg: { token: "", hex: "", opacity: 100 },
    image: { path: "", alt: "", overlay: 0 },
    padding: { top: 40, right: 0, bottom: 40, left: 0 },
    margin: { top: 0, bottom: 0 },
    radius: 0,
  },
  body: params.body,
  blocks: [],
});

export interface BuildDemoPostOptions {
  lorem?: boolean;
}

export const buildDemoPost = (
  options: BuildDemoPostOptions = {},
): ObjectIdToStr<IPostBySlug> => {
  const lorem = Boolean(options.lorem);
  const text = lorem ? LOREM_TEXT : REAL_TEXT;
  const faqData = lorem ? FAQ_LOREM : FAQ_REAL;

  const leadSection = {
    uid: "bonusy",
    title: text.h1,
    comment: "",
    children: [],
    layout: {
      width: "container" as const,
      bg: { token: "", hex: "", opacity: 100 },
      image: { path: "", alt: "", overlay: 0 },
      padding: { top: 24, right: 0, bottom: 24, left: 0 },
      margin: { top: 0, bottom: 0 },
      radius: 0,
    },
    body: [
      marker("rating-strip", { "uniq-id": "demo-rating" }),
      marker("biography-writer", { "uniq-id": "demo-author" }),
      marker("text-image", { "uniq-id": "demo-lead-image" }),
      marker("button-ref", {
        name: `Забрать бонус ${lorem ? "" : "25 000 Kč"}`.trim(),
        slug: "goldbet-casino",
      }),
      ...text.intro.map((paragraph) => `<p>${paragraph}</p>`),
      `<h3>${text.listTitle}</h3>`,
      `<ul>${text.list.map((item) => `<li>${item}</li>`).join("")}</ul>`,
    ].join(""),
    blocks: [],
  };

  const offersSection = {
    uid: "offery",
    title: "Лучшие офферы",
    comment: "",
    children: [],
    layout: {
      width: "container" as const,
      bg: { token: "", hex: "", opacity: 100 },
      image: { path: "", alt: "", overlay: 0 },
      padding: { top: 40, right: 0, bottom: 40, left: 0 },
      margin: { top: 0, bottom: 0 },
      radius: 0,
    },
    body: [
      `<p>${text.offersLead}</p>`,
      marker("grid-cards", { "uniq-id": "demo-offers" }),
    ].join(""),
    blocks: [],
  };

  const paymentsSection = {
    uid: "platezhi",
    title: "Платежи",
    comment: "",
    children: [],
    layout: {
      width: "container" as const,
      bg: { token: "", hex: "", opacity: 100 },
      image: { path: "", alt: "", overlay: 0 },
      padding: { top: 40, right: 0, bottom: 40, left: 0 },
      margin: { top: 0, bottom: 0 },
      radius: 0,
    },
    body: [
      `<p>${text.paymentsLead}</p>`,
      marker("data-table", { "uniq-id": "demo-table" }),
    ].join(""),
    blocks: [],
  };

  const prosConsSection = {
    uid: "plusy-minusy",
    title: "Плюсы и минусы",
    comment: "",
    children: [],
    layout: {
      width: "container" as const,
      bg: { token: "", hex: "", opacity: 100 },
      image: { path: "", alt: "", overlay: 0 },
      padding: { top: 40, right: 0, bottom: 40, left: 0 },
      margin: { top: 0, bottom: 0 },
      radius: 0,
    },
    body: marker("pros-cons-post", { "uniq-id": "demo-pros" }),
    blocks: [],
  };

  const faqSection = {
    uid: "faq",
    title: "FAQ",
    comment: "",
    children: [],
    layout: {
      width: "container" as const,
      bg: { token: "", hex: "", opacity: 100 },
      image: { path: "", alt: "", overlay: 0 },
      padding: { top: 40, right: 0, bottom: 40, left: 0 },
      margin: { top: 0, bottom: 0 },
      radius: 0,
    },
    body: marker("faq", { "uniq-id": "faq" }),
    blocks: [],
  };

  const verdictSection = {
    uid: "verdikt",
    title: "Вердикт",
    comment: "",
    children: [],
    layout: {
      width: "container" as const,
      bg: { token: "", hex: "", opacity: 100 },
      image: { path: "", alt: "", overlay: 0 },
      padding: { top: 40, right: 0, bottom: 40, left: 0 },
      margin: { top: 0, bottom: 0 },
      radius: 0,
    },
    body: [
      `<p>${text.verdictLead}</p>`,
      marker("biography-writer", {
        "uniq-id": "demo-author",
        variant: "signature",
      }),
    ].join(""),
    blocks: [],
  };

  const typographySection = buildContrastTypographySection();

  const libraryGridCards = buildLibrarySection({
    uid: "lib-grid-cards",
    title: "Библиотека: карточки (grid-cards)",
    body: [
      ["text", "Текст"],
      ["image-caption", "Фото + подпись"],
      ["image-title-text", "Фото + текст"],
      ["horizontal", "Горизонтальные"],
      ["image", "Только фото"],
      ["offer", "Оффер"],
    ]
      .map(([value, label]) =>
        variantRow(
          `${value} — ${label}`,
          marker("grid-cards", { "uniq-id": `demo-cards-${value}` }),
        ),
      )
      .join(""),
  });

  const libraryDataTable = buildLibrarySection({
    uid: "lib-data-table",
    title: "Библиотека: таблица (data-table)",
    body: [
      ["classic", "Таблица"],
      ["ranking", "Топ"],
      ["rows", "Карточки-строки"],
      ["compare", "Сравнение"],
      ["key-value", "Досье"],
    ]
      .map(([value, label]) =>
        variantRow(
          `${value} — ${label}`,
          marker("data-table", { "uniq-id": `demo-table-${value}` }),
        ),
      )
      .join(""),
  });

  const libraryTextImage = buildLibrarySection({
    uid: "lib-text-image",
    title: "Библиотека: картинка + текст (text-image)",
    body: [
      ["split", "Колонки"],
      ["overlay", "Текст поверх"],
      ["card", "Карточка"],
      ["caption", "Подпись"],
      ["banner", "Баннер"],
    ]
      .map(([value, label]) =>
        variantRow(
          `${value} — ${label}`,
          marker("text-image", { "uniq-id": `demo-ti-${value}` }),
        ),
      )
      .join(""),
  });

  const libraryFaq = buildLibrarySection({
    uid: "lib-faq",
    title: "Библиотека: FAQ",
    body: ["list", "accordion", "numbered", "grid", "chat"]
      .map((value) => variantRow(value, marker("faq", { variant: value })))
      .join(""),
  });

  const libraryProsCons = buildLibrarySection({
    uid: "lib-pros-cons",
    title: "Библиотека: плюсы и минусы (pros-cons)",
    body: [
      ["two-col", "Две колонки"],
      ["stacked", "Столбиком"],
      ["merged", "Один список"],
      ["scoreboard", "Счёт"],
      ["table", "Таблица"],
    ]
      .map(([value, label]) =>
        variantRow(
          `${value} — ${label}`,
          marker("pros-cons-post", { "uniq-id": `demo-pros-${value}` }),
        ),
      )
      .join(""),
  });

  const libraryToc = buildLibrarySection({
    uid: "lib-toc",
    title: "Библиотека: оглавление (table-content)",
    body: ["box", "rule", "pills", "columns", "steps"]
      .map((value) =>
        variantRow(value, marker("table-content", { variant: value })),
      )
      .join(""),
  });

  const libraryBiography = buildLibrarySection({
    uid: "lib-biography",
    title: "Библиотека: автор (biography-writer)",
    body: ["card", "inline", "banner", "centered", "signature"]
      .map((value) =>
        variantRow(
          value,
          marker("biography-writer", {
            "uniq-id": "demo-author",
            variant: value,
          }),
        ),
      )
      .join(""),
  });

  const libraryContact = buildLibrarySection({
    uid: "lib-contact",
    title: "Библиотека: контакты (contact-us)",
    body: ["card", "plain", "split"]
      .map((value) =>
        variantRow(value, marker("contact-us", { variant: value })),
      )
      .join(""),
  });

  const libraryButtonRef = buildLibrarySection({
    uid: "lib-button-ref",
    title: "Библиотека: кнопка (button-ref)",
    body: ["solid", "outline", "soft", "block"]
      .map((value) =>
        variantRow(
          value,
          marker("button-ref", {
            variant: value,
            name: "Играть в GoldBet",
            slug: "goldbet-casino",
            ...(value === "block" ? { note: "100 % до 25 000 Kč · 18+" } : {}),
          }),
        ),
      )
      .join(""),
  });

  const libraryRatingStrip = buildLibrarySection({
    uid: "lib-rating-strip",
    title: "Библиотека: рейтинг (rating-strip)",
    body: ["strip", "scorecard", "bars", "chips"]
      .map((value) =>
        variantRow(value, marker("rating-strip", { variant: value })),
      )
      .join(""),
  });

  const gridCardsVariants = [
    "text",
    "image-caption",
    "image-title-text",
    "horizontal",
    "image",
    "offer",
  ].map((variant) => buildGridCardsEntry(`demo-cards-${variant}`, variant));

  const dataTableVariants = [
    "classic",
    "ranking",
    "rows",
    "compare",
    "key-value",
  ].map((variant) => buildDataTableEntry(`demo-table-${variant}`, variant));

  const textImageVariants = [
    ["split", "Приветственный пакет до 25 000 Kč — вейджер ×35."],
    ["overlay", "Текст поверх нижней части широкой картинки."],
    ["card", "Картинка и текст внутри одной карточки с рамкой."],
    ["caption", "Широкая картинка с подписью-плашкой снизу."],
    ["banner", "Узкий баннер сверху, текст в панели под ним."],
  ].map(([variant, sample]) =>
    buildTextImageEntry(`demo-ti-${variant}`, variant, sample),
  );

  const prosConsVariants = [
    "two-col",
    "stacked",
    "merged",
    "scoreboard",
    "table",
  ].map((variant) => buildProsConsEntry(`demo-pros-${variant}`, variant));

  return {
    _id: "demo-post",
    title: text.h1,
    slug: "ui",
    content: "",
    sections: [
      leadSection,
      offersSection,
      paymentsSection,
      prosConsSection,
      faqSection,
      verdictSection,
      typographySection,
      libraryGridCards,
      libraryDataTable,
      libraryTextImage,
      libraryFaq,
      libraryProsCons,
      libraryToc,
      libraryBiography,
      libraryContact,
      libraryButtonRef,
      libraryRatingStrip,
    ],
    isActive: true,
    breadcrumbTitle: "GoldBet Casino",
    breadcrumbs: [
      { title: "", slug: "/" },
      { title: "Казино", slug: "/casino/" },
      { title: "GoldBet Casino", slug: "/casino/goldbet-casino/" },
    ],
    datePosted: "2026-09-12T00:00:00.000Z",
    metaTag: {
      title: text.h1,
      description: "Демо-статья страницы /ui — не индексируется.",
      robots: "noindex, nofollow",
      keyword: "",
      canonical: "",
      lang: "ru",
      alternates: [],
    },
    shortcodesConfig: {
      prosConsPosts: [buildProsConsEntry("demo-pros", ""), ...prosConsVariants],
      casinoRatings: [],
      bookmakerRatings: [],
      casinoBonuses: [],
      bookmakerBonuses: [],
      gridCards: [buildGridCardsEntry("demo-offers", ""), ...gridCardsVariants],
      miniCasinoReviews: [],
      miniBookmakerReviews: [],
      faq: { variant: "", data: faqData },
      dataTables: [buildDataTableEntry("demo-table", ""), ...dataTableVariants],
      biographyWriters: [buildBiographyEntry()],
      tableContent: {
        variant: "",
        data: [
          {
            title: text.h1,
            value: "bonusy",
            initialContent: "",
            isActive: false,
          },
          {
            title: "Лучшие офферы",
            value: "offery",
            initialContent: "",
            isActive: true,
          },
          {
            title: "Платежи",
            value: "platezhi",
            initialContent: "",
            isActive: true,
          },
          {
            title: "Плюсы и минусы",
            value: "plusy-minusy",
            initialContent: "",
            isActive: true,
          },
          { title: "FAQ", value: "faq", initialContent: "", isActive: true },
          {
            title: "Вердикт",
            value: "verdikt",
            initialContent: "",
            isActive: true,
          },
        ],
      },
      textImages: [
        buildTextImageEntry("demo-lead-image", "", text.intro[0] || ""),
        ...textImageVariants,
      ],
      ratingStrip: {
        variant: "",
        score: 4.6,
        facts: [
          { label: "Лицензия", value: "MGA" },
          { label: "Вывод", value: "до 24 ч" },
          { label: "Мин. депозит", value: "200 Kč" },
          { label: "Игр", value: "3 800+" },
        ],
      },
    },
    isDeleted: false,
    createdAt: new Date("2026-09-12T00:00:00.000Z"),
    updatedAt: new Date("2026-09-16T00:00:00.000Z"),
  };
};
