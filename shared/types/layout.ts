export interface HeaderItem {
  kind: "ref" | "page" | "logo";
  label: string;
  link?: string;
  style: "primary" | "active" | "outline" | "link";
  position: "left" | "center" | "right";
  children?: HeaderItem[];
}

// Кнопка шапки; она же запасной CTA для хиро и липкой панели, когда на
// странице нет своей. Пустой `link` означает реф-ссылку бренда, а не
// внутренний адрес.
export interface HeaderCta {
  label: string;
  link: string;
  note: string;
}

export interface FooterLink {
  name: string;
  link: string;
}

export interface FooterLegalLogo {
  src: string;
  alt: string;
}

export interface SiteLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// `settings.brand` в базе сайта — плоская запись бренда. В конфиг шаблона она
// раскладывается по трём местам (`site`, `logo`, `img`), см. buildSiteConfig.
export interface SiteBrand {
  name: string;
  lang: string;
  brandSlug: string;
  logo: SiteLogo;
  favicon: { src: string };
  imgRoundCorner: string;
}

export interface SiteLayout {
  header: {
    items: HeaderItem[];
    cta: HeaderCta;
  };
  footer: {
    title: string;
    body: string;
    links: FooterLink[];
    legalLogos: FooterLegalLogo[];
  };
  breadcrumbs: { homeLabel: string };
}

// Дерево `seoConfig.translates` целиком: ключи задаёт панель
// (`seo-conf-defaults.js`), она же держит фолбэки.
export interface SiteStrings {
  showMore: string;
  showLess: string;
  lastUpdated: string;
  btnMoreInfo: string;
  playNow: string;

  gdprBanner: {
    btnAgree: string;
    btnMoreInfo: string;
    text: string;
  };

  tableContent: string;

  shortcodes: {
    prosAndCons: {
      pros: string;
      cons: string;
    };
  };

  contacts: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    invalidEmail: string;
    submit: string;
  };

  auth: {
    login: string;
    register: string;
  };

  error: {
    notFound: string;
    backHome: string;
  };

  entity: {
    readReview: string;
    licence: string;
    foundedYear: string;
    bonus: string;
    bonuses: string;
    minDeposit: string;
    payoutSpeed: string;
    maxPayout: string;
    gamesCount: string;
    sportsBetting: string;
    mobileApp: string;
    paymentMethods: string;
    softwareProviders: string;
    bestFeatures: string;
    customerSupport: string;
    gameTypes: string;
    yes: string;
    no: string;
  };
}

// Форма, в которой конфиг сайта видят компоненты: `seo.conf.ts` шаблона,
// перекрытый записью из базы. `site.theme` живёт только в образе — режим темы
// сайт берёт из `uiTheme.mode`, а это запасной вариант для сайта без темы.
export interface SiteConfig {
  site: {
    name: string;
    lang: string;
    theme: string;
    brandSlug: string;
  };
  logo: SiteLogo;
  favicon: { src: string };
  img: { modifiers: { roundCorner: string } };
  layout: SiteLayout;
  translates: SiteStrings;
}
