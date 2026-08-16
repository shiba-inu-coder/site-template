export const seoConfig = {
  site: {
    name: "Mafia Casino",
    lang: "de",
    // "dark" | "light"
    theme: "dark",
    // Слаг бренда для реф-ссылок: имя казино в нижнем регистре, пробелы → дефис.
    brandSlug: "mafia-casino",
  },
  logo: {
    src: "mafia-casinode-de/mafia-casino-logo",
    alt: "Mafia Casino",
    width: 152,
    height: 35,
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
      title: `mafia-casinode-de.de © ${new Date().getFullYear()} Alle Rechte vorbehalten.`,
      disclaimer:
        "mafia-casinode-de.de dient ausschließlich Informationszwecken im Zusammenhang mit Online-Casinos und Glücksspielen. Die Website veranstaltet oder betreibt keine Glücksspiele, fungiert nicht als Casino-Betreiber und steht in keiner direkten Verbindung zu Unternehmen, die Glücksspieldienstleistungen anbieten. Sämtliche auf der Website veröffentlichten Inhalte, einschließlich Bewertungen, Ranglisten und Bonusbeschreibungen, dienen ausschließlich der Information und stellen weder eine Rechts-, Finanz- noch Anlageberatung dar. Bevor Nutzer die Dienste eines Glücksspielanbieters in Anspruch nehmen, sollten sie die aktuellen Angebotsbedingungen eigenständig prüfen und sicherstellen, dass die Teilnahme an Glücksspielen nach den in Deutschland geltenden gesetzlichen Bestimmungen zulässig ist.",
      notice: `<b>Hinweis</b><br/> Auf mafia-casinode-de.de können Affiliate-Links zu externen Websites enthalten sein. Wenn Nutzer über diese Links bestimmte Aktionen ausführen, beispielsweise ein Konto registrieren, eine Einzahlung tätigen oder ein Angebot eines Partners nutzen, kann mafia-casinode-de.de eine Provisionsvergütung erhalten. Die Website übernimmt keine Verantwortung für Inhalte, Werbeaktionen, Geschäftsbedingungen oder Datenschutzrichtlinien externer Websites. Es gelten ausschließlich die Bedingungen des jeweiligen Anbieters.`,
      links: [
        {
          name: "Datenschutzerklärung",
          link: "/datenschutzerklaerung/",
        },

        {
          name: "Ueber uns",
          link: "/ueber-uns/",
        },

        {
          name: "Kontakt",
          link: "/kontakt/",
        },

        {
          name: "Verantwortungsvolles Spielen",
          link: "/verantwortungsvolles-spielen/",
        },
      ],
      legalLogos: [
        {
          alt: "18+",
          src: "casino-f1-cz/responsible-gaming/18plus.svg",
        },
        {
          alt: "Gordon Moody",
          src: "casino-f1-cz/responsible-gaming/gordon-moody",
        },
      ],
    },
  },
  translates: {
    showMore: "Mehr anzeigen",
    showLess: "Weniger anzeigen",
    lastUpdated: "Zuletzt aktualisiert",
    btnMoreInfo: "Mehr erfahren",
    playNow: "Jetzt spielen",

    gdprBanner: {
      btnAgree: "Ich stimme zu",
      btnMoreInfo: "Mehr erfahren",
      text: "Diese Website verwendet Cookies. Durch die weitere Nutzung der Website stimmen Sie der Verwendung von Cookies zu.",
    },

    bonusBanner: {
      btn: "Bonus sichern",
    },

    tableContent: "Inhaltsverzeichnis anzeigen",

    shortcodes: {
      prosAndCons: {
        pros: "Vorteile",
        cons: "Nachteile",
      },
    },

    contacts: {
      nameLabel: "Vor- und Nachname *",
      emailLabel: "E-Mail *",
      messageLabel: "Nachricht *",
      invalidEmail: "Die E-Mail-Adresse ist ungültig",
      submit: "Senden",
    },

    auth: {
      login: "Anmelden",
      register: "Registrieren",
    },
  },
};
