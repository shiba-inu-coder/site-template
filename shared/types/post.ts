import type { Document, Model, ObjectId } from "mongoose";

export interface PostGridCard {
  data: {
    uniqId: string;
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
      img: {
        path: string;
        alt: string;
      };
    }[];
  };
}

export interface PostTextImage {
  data: {
    uniqId: string;
    text: string;
    img: {
      path: string;
      alt: string;
    } | null;
    imgSide: "left" | "right";
    imgMobileSide: "top" | "bottom";
    imgWidth: string;
    imgHeight: string;
    imgRoundCorner: string;
    buttonText: string;
    refLink: string;
  };
}

export interface PostProsCons {
  data: {
    uniqId: string;
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

export interface PostTableContent {
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

export interface PostSectionLayout {
  width: "container" | "full";
  bg: PostSectionBg;
  image: PostSectionImage;
  padding: "none" | "sm" | "md" | "lg";
}

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
    btnName?: string;
    showTableHead: boolean;
    defaultCountRows: string;
    columns: Column[];
    rows: Row[];
  };
}

export interface PostFaq {
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
  intro: string;
  introImg: {
    img: {
      path: string;
      alt: string;
    };
    width: string;
    height: string;
    isFullScreen: boolean;
  };
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
