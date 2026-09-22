import type { Document, Model, ObjectId } from "mongoose";

export interface PostGridCard {
  data: {
    uniqId: string;
    // Варианты вёрстки: text | image-caption | image-title-text | horizontal |
    // offer. "1" и "2" — значения дошорткодовой эпохи, компонент переводит их
    // в image-caption и image-title-text.
    variant: string;
    refLink: string;
    refLinkType: RefLinkType;
    cardsPerRowDesktop: string;
    imgHeight: string;
    imgWidth: string;
    imgRoundCorner: string;
    data: {
      title: string;
      text: string;
      buttonText: string;
      refLink: string;
      refLinkType: RefLinkType;
      // Только вариант offer: лого текстом (иначе рисуется img), оценка 0–5 и
      // строка бонуса.
      logo?: string;
      score?: string;
      bonus?: string;
      img: {
        path: string;
        alt: string;
      } | null;
    }[];
  };
}

export interface PostTextImage {
  data: {
    uniqId: string;
    variant?: string;
    text: string;
    img: {
      path: string;
      alt: string;
    } | null;
    imgHint: string;
    imgSide: "left" | "right" | "full";
    imgMobileSide: "top" | "bottom";
    imgColumn: "33" | "50";
    imgRoundCorner: string;
    // Из дошорткодовой эпохи: кнопка была отдельным полем записи, пока
    // текст не поглотил её в шорткоде 2a. Старые записи ещё несут оба поля.
    buttonText: string;
    refLink: string;
  };
}

export interface PostProsCons {
  data: {
    uniqId: string;
    variant?: string;
    data: {
      prosList: string[];
      consList: string[];
    };
  };
}

export interface PostTableContentItem {
  title: string;
  value: string;
  initialContent: string;
  isActive: boolean;
}

// Синглтон: своей записи на блок нет, вариант перекрывает тему для всей
// статьи целиком.
export interface PostTableContent {
  variant?: string;
  data: PostTableContentItem[];
}

export interface PostSectionBg {
  token: string;
  hex: string;
  opacity: number;
}

export interface PostSectionImage {
  path: string;
  alt: string;
  overlay: number;
}

export interface PostSectionPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PostSectionMargin {
  top: number;
  bottom: number;
}

// Пресет, которым панель хранила отступ до перехода на px — запись старой
// эпохи в site-template ещё может прийти в этой форме. `PostSectionLayout`
// сам остаётся нормализованной (px) формой — принять и то, и другое умеет
// только normalizeSectionLayout в section-style.ts, через RawPostSectionLayout.
export type LegacyPostSectionPadding = "none" | "sm" | "md" | "lg";

export interface PostSectionLayout {
  width: "container" | "full";
  bg: PostSectionBg;
  image: PostSectionImage;
  padding: PostSectionPadding;
  margin: PostSectionMargin;
  radius: number;
}

// Вход normalizeSectionLayout: запись любой эпохи — padding может быть ещё
// строковым пресетом, margin/radius могут отсутствовать вовсе.
export type RawPostSectionLayout = Partial<
  Omit<PostSectionLayout, "padding">
> & {
  padding?: PostSectionPadding | LegacyPostSectionPadding;
};

export interface PostSectionChild {
  tag: "h3" | "h4";
  title: string;
  comment: string;
}

export interface PostSection {
  uid: string;
  title: string;
  comment: string;
  children: PostSectionChild[];
  body: string;
  blocks: string[];
  layout: PostSectionLayout;
}

export interface PostMetaTag {
  title?: string;
  description?: string;
  robots?: string;
  keyword?: string;
  canonical?: string;
  lang?: string;
  alternates: {
    hreflang: string;
    href: string;
  }[];
}

export interface Row {
  [key: string]: string;
}

export interface Column {
  title: string;
  name: string;
}

export interface PostDataTable {
  data: {
    uniqId: string;
    variant?: string;
    // Модификаторы поверх варианта, а не варианты: любой из них применим к
    // classic и ranking одинаково.
    density?: string;
    head?: string;
    striped?: boolean;
    btnName?: string;
    refLink?: string;
    showTableHead: boolean;
    defaultCountRows: string;
    columns: Column[];
    rows: Row[];
  };
}

export interface PostFaq {
  variant?: string;
  data: { label: string; value: string }[];
}

export interface PostBanner {
  ribbon: string;
  text: string;
  entity: {
    _id: ObjectId;
    title: string;
    logo: {
      path: string;
      alt: string;
    };
    slug: string;
  };
  entityModel: EntityModel;
}

export interface PostBreadcrumb {
  title: string;
  slug: string;
}

export type PostCasinoRatingEntity = Omit<
  ICasino<
    Pick<IGameType, "title" | "order">,
    Pick<ISoftwareProvider, "title" | "logo">,
    Pick<IPaymentMethod, "title" | "logo">,
    Pick<IPost, "slug">
  >,
  "refLink" | "createdAt" | "updatedAt" | "website" | "owner" | "closedYear"
>;

export type PostBookmakerRatingEntity = Omit<
  IBookmaker<Pick<IPaymentMethod, "title" | "logo">, Pick<ISport, "title">>,
  "refLink" | "createdAt" | "updatedAt" | "website" | "owner" | "closedYear"
>;
export interface PostCasinoRating<E, B> {
  data: {
    uniqId: string;
    data: {
      entity: E;
      bonuses: B[];
    }[];
  };
}
export interface PostBookmakerRating<E, B> {
  data: {
    uniqId: string;
    data: {
      entity: E;
      bonuses: B[];
    }[];
  };
}

export interface PostCasinoBonuses<E, B> {
  data: {
    uniqId: string;
    data: {
      entity: E;
      bonuses: B[];
    }[];
  };
}
export interface PostCasinoBonuses<E, B> {
  data: {
    uniqId: string;
    data: {
      entity: E;
      bonuses: B[];
    }[];
  };
}

export interface PostMiniCasinoReview<E = ObjectId, B = ObjectId> {
  data: {
    uniqId: string;
    title: string;
    text: string;
    entity: E;
    bonuses: B[];
    img: {
      src: string;
      alt: string;
      width: string;
      height: string;
      format: string;
      roundCorner: string;
    };
    prosCons: {
      prosList: string[];
      consList: string[];
    };
  };
}
export interface PostMiniBookmakerReview<E = ObjectId, B = ObjectId> {
  data: {
    uniqId: string;
    title: string;
    text: string;
    entity: E;
    bonuses: B[];
    img: {
      src: string;
      alt: string;
      width: string;
      height: string;
      format: string;
      roundCorner: string;
    };
    prosCons: {
      prosList: string[];
      consList: string[];
    };
  };
}

export interface PostBiographyWriter<W> {
  data: {
    uniqId: string;
    variant?: string;
    data: {
      writer: W;
    };
  };
}

export interface IPost<
  Entity = ObjectId,
  BiographyWriter = ObjectId,
  MiniReviewBonuse = ObjectId,
  EntityRatingsBonuse = ObjectId,
  EntityBonuses = ObjectId,
  CasinoBonusesEntity = ObjectId,
  BookmakerBonusesEntity = ObjectId,
  MiniCasinoReviewEntity = ObjectId,
  MiniBookmakerReviewEntity = ObjectId,
  PostCasinoRatingEntity = ObjectId,
  PostBookmakerRatingEntity = ObjectId,
  EntityBonus = ObjectId,
> {
  __v?: number;
  _id: ObjectId;
  title: string;
  banner?: PostBanner;
  slug: string;
  content: string;
  sections: PostSection[];
  isActive: boolean;
  breadcrumbTitle: string;
  breadcrumbs: PostBreadcrumb[];
  datePosted: string;
  metaTag: PostMetaTag;
  shortcodesConfig: {
    prosConsPosts: PostProsCons[];
    casinoRatings: PostCasinoRating<
      PostCasinoRatingEntity,
      EntityRatingsBonuse
    >[];
    bookmakerRatings: PostBookmakerRating<
      PostBookmakerRatingEntity,
      EntityRatingsBonuse
    >[];
    casinoBonuses: PostCasinoBonuses<CasinoBonusesEntity, EntityBonuses>[];
    bookmakerBonuses: PostCasinoBonuses<
      BookmakerBonusesEntity,
      EntityBonuses
    >[];
    gridCards: PostGridCard[];
    miniCasinoReviews: PostMiniCasinoReview<
      MiniCasinoReviewEntity,
      MiniReviewBonuse
    >[];
    miniBookmakerReviews: PostMiniCasinoReview<
      MiniBookmakerReviewEntity,
      MiniReviewBonuse
    >[];
    faq: PostFaq;
    dataTables: PostDataTable[];
    biographyWriters: PostBiographyWriter<BiographyWriter>[];
    tableContent: PostTableContent;
    textImages: PostTextImage[];
  };
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPostDocument extends Omit<IPost, "_id">, Document<ObjectId> {}

export type InputPost<E = ObjectId> = Omit<
  IPost<E, ObjectId>,
  "_id" | "createdAt" | "updatedAt"
>;

export type IPostModel = Model<IPost>;
