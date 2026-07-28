import deepClone from "rfdc/default";

const baseInital: Omit<IPost, "_id" | "isReviewPost" | "breadcrumbs"> = {
  title: "",
  slug: "",
  entity: undefined,
  entityModel: undefined,
  content: "",
  entityBonus: undefined,
  intro: "",
  introImg: {
    img: {
      path: "",
      alt: "",
    },
    width: "auto",
    height: "auto",
    isFullScreen: false,
  },
  breadcrumbTitle: "",
  isActive: false,
  datePosted: "",
  metaTag: {
    title: "",
    description: "",
    robots: "",
    keyword: "",
    canonical: "",
    alternates: [],
    lang: "",
  },
  shortcodesConfig: {
    prosConsPosts: [],
    casinoRatings: [],
    bookmakerRatings: [],
    casinoBonuses: [],
    bookmakerBonuses: [],
    dataTables: [],
    gridCards: [],
    miniCasinoReviews: [],
    miniBookmakerReviews: [],
    faq: {
      data: [],
    },
    tableContent: {
      data: [],
    },
    biographyWriters: [],
  },
  isDeleted: false,
};

export const initialClientStatePost = deepClone(baseInital);

export const initialStateWriter: Omit<
  IWriter,
  "_id" | "updatedAt" | "createdAt"
> = {
  username: "",
  fullName: "",
  firstName: "",
  lastName: "",
  email: "",
  avatar: {
    path: "",
    alt: "",
  },
  position: "",
  info: "",
};

export const initialStateGameType: Omit<
  IGameType,
  "_id" | "updatedAt" | "createdAt"
> = {
  title: "",
  order: 0,
};

export const initialStatePaymentMethod: Omit<
  IPaymentMethod,
  "_id" | "updatedAt" | "createdAt"
> = {
  title: "",
  logo: {
    path: "",
    alt: "",
  },
};
export const initialStateSetting: ISetting = {
  robotsTXT: undefined,
  externalSitemapUrl: "",
  redirectsRoutes: [],
  headerLinks: [],
};

export const initialStateSoftwareProvider: Omit<
  ISoftwareProvider,
  "_id" | "updatedAt" | "createdAt"
> = {
  title: "",
  logo: {
    path: "",
    alt: "",
  },
};
export const initialStateSport: Omit<
  ISport,
  "_id" | "updatedAt" | "createdAt"
> = {
  title: "",
};

export const initialStateCasino: ObjectIdToStr<
  Omit<ICasino, "_id" | "updatedAt" | "createdAt">
> = {
  title: "",
  logo: {
    path: "",
    alt: "",
  },
  refLink: "",
  slug: "",
  prosList: [],
  consList: [],
  reviewPost: undefined,
  ribbon: "",
  rating: 0,
  isVipProgram: false,
  sportsBetting: false,
  website: "",
  owner: "",
  languages: "",
  safety: {
    ssl: false,
    responsibleGambling: false,
    depositLimits: false,
    lossLimits: false,
    timeLimits: false,
    selfExclusionTool: false,
  },
  gameTypes: [],
  softwareProviders: [],
  bonuses: [],
  paymentMethods: [],
  numberCasinosGame: "",
  licence: "",
  maximumCashout: "",
  benefits: [],
  payoutsSpeed: "",
  yearEstablished: "",
  minimumDeposit: "",
  mobileApps: [],
  closedYear: "",
  customerServices: [],
  isDeleted: false,
};
export const initialStateBookmaker: ObjectIdToStr<
  Omit<IBookmaker, "_id" | "updatedAt" | "createdAt">
> = {
  title: "",
  logo: {
    path: "",
    alt: "",
  },
  refLink: "",
  slug: "",
  benefits: [],
  bonuses: [],
  sports: [],
  bonus: "",
  ribbon: "",
  topFeature: "",
  paymentMethods: [],
  rating: 0,
  payoutsSpeed: "",
  yearEstablished: "",
  mobileApps: [],
  minimumDeposit: "",
  licence: "",
  termsCondition: "",
  isDeleted: false,
};
const initialStateBonus: ObjectIdToStr<
  Omit<IBonus, "_id" | "updatedAt" | "createdAt" | "entityModel">
> = {
  title: "",
  text: "",
  minDeposit: "",
  maxCashout: "",
  wager: "",
};
export const initialStateCasinoBonus = (
  entity: string,
): ObjectIdToStr<Omit<IBonus, "_id" | "updatedAt" | "createdAt">> => ({
  ...deepClone(initialStateBonus),
  entity,
  entityModel: EntityModel.Casino,
});

export const initialStateBookmakerBonus = (
  entity: string,
): ObjectIdToStr<Omit<IBonus, "_id" | "updatedAt" | "createdAt">> => ({
  ...deepClone(initialStateBonus),
  entity,
  entityModel: EntityModel.Bookmaker,
});
