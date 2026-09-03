export const seoConfig = {
  site: {
    name: "",
    lang: "en",
    // "dark" | "light". Переворачивает только нейтральный слой (--color-surface-*):
    // шкала primary — это уже цвета бренда, светлые у светлого бренда.
    theme: "light",
    // Слаг бренда для реф-ссылок: имя казино в нижнем регистре, пробелы → дефис.
    brandSlug: "",
  },
  logo: {
    src: "",
    alt: "",
    // Собственные размеры файла. Отрисовка идёт по высоте, ширина считается
    // отсюда — см. app/utils/logo-size.ts.
    width: 0,
    height: 0,
  },
  img: {
    modifiers: {
      roundCorner: "15",
    },
  },
  layout: {
    header: {
      links: [],
    },

    footer: {
      title: "",
      body: "",
      links: [],
      legalLogos: [],
    },
  },
  translates: {
    showMore: "Show more",
    showLess: "Show less",
    lastUpdated: "Last updated",
    btnMoreInfo: "Learn more",
    playNow: "Play now",

    gdprBanner: {
      btnAgree: "I agree",
      btnMoreInfo: "Learn more",
      text: "This website uses cookies. By continuing to use the website, you agree to the use of cookies.",
    },

    bonusBanner: {
      btn: "Claim bonus",
    },

    tableContent: "Show table of contents",

    shortcodes: {
      prosAndCons: {
        pros: "Pros",
        cons: "Cons",
      },
    },

    contacts: {
      nameLabel: "Full name *",
      emailLabel: "E-mail *",
      messageLabel: "Message *",
      invalidEmail: "The e-mail address is invalid",
      submit: "Send",
    },

    auth: {
      login: "Log in",
      register: "Register",
    },

    error: {
      notFound: "Page not found — back to the homepage",
      backHome: "Back to the homepage",
    },

    entity: {
      readReview: "Read review",
      licence: "Licence",
      foundedYear: "Founded",
      bonus: "Bonus",
      bonuses: "Bonuses",
      minDeposit: "Minimum deposit",
      payoutSpeed: "Payout speed",
      maxPayout: "Maximum payout",
      gamesCount: "Number of games",
      sportsBetting: "Sports betting",
      mobileApp: "Mobile app",
      paymentMethods: "Payment methods",
      softwareProviders: "Software providers",
      bestFeatures: "Best features",
      customerSupport: "Customer support",
      gameTypes: "Game types",
      yes: "Yes",
      no: "No",
    },
  },
};
