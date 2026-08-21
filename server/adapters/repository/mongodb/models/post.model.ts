import { model, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import { PostSlugRegex } from "#shared/constants/base";

import { MetaTagSchema } from "./schemas/MetaTag";
import { CasinoRatingsSchema } from "./schemas/CasinoRatings";
import { CasinoBonusesSchema } from "./schemas/CasinoBonuses";
import { BookmakerRatingsSchema } from "./schemas/BookmakerRatings";
import { BookmakerBonusesSchema } from "./schemas/BookmakerBonuses";
import { FaqSchema } from "./schemas/Faq";
import { GridCardSchema } from "./schemas/GridCard";
import { TableContentSchema } from "./schemas/TableContent";
import { BannerSchema } from "./schemas/Banner";
import { ProsConsPostSchema } from "./schemas/ProsConsPost";
import { BiographyWriterSchema } from "./schemas/BiographyWriter";
import { DataTableSchema } from "./schemas/DataTable";
import { MiniCasinoReviewSchema } from "./schemas/MiniCasinoReview";
import { MiniBookmakerReviewSchema } from "./schemas/MiniBookmakerReview";
import { TextImageSchema } from "./schemas/TextImage";
import { SectionSchema } from "./schemas/Section";

const ModelSchema = new Schema<IPostDocument, IPostModel>(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    banner: {
      type: BannerSchema,
      required: false,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string): boolean {
          return PostSlugRegex.test(v);
        },
        message: () =>
          "The input must consist of lowercase letters only, with optional hyphens separating words. It cannot start or end with a hyphen, and consecutive hyphens are not allowed.",
      },
      required: true,
      unique: true,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    sections: {
      type: [SectionSchema],
      default: () => [],
    },
    intro: {
      type: String,
      trim: true,
      default: "",
    },
    introImg: {
      img: {
        path: {
          type: String,
          trim: true,
          default: "",
        },
        alt: {
          type: String,
          trim: true,
          default: "",
        },
      },
      width: {
        type: String,
        trim: true,
        default: "auto",
      },
      height: {
        type: String,
        trim: true,
        default: "auto",
      },
      isFullScreen: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    breadcrumbTitle: {
      type: String,
      trim: true,
      default: "",
    },
    datePosted: {
      type: String,
      trim: true,
      default: "",
    },
    metaTag: MetaTagSchema,
    shortcodesConfig: {
      biographyWriters: {
        type: BiographyWriterSchema,
        default: () => [],
      },
      casinoRatings: {
        type: CasinoRatingsSchema,
        default: () => [],
      },
      bookmakerRatings: {
        type: BookmakerRatingsSchema,
        default: () => [],
      },
      casinoBonuses: {
        type: CasinoBonusesSchema,
        default: () => [],
      },
      bookmakerBonuses: {
        type: BookmakerBonusesSchema,
        default: () => [],
      },
      dataTables: {
        type: DataTableSchema,
        default: () => [],
      },
      faq: {
        type: FaqSchema,
        default: () => ({ data: [] }),
      },
      gridCards: {
        type: GridCardSchema,
        default: () => [],
      },
      prosConsPosts: {
        type: ProsConsPostSchema,
        default: () => [],
      },
      miniCasinoReviews: {
        type: MiniCasinoReviewSchema,
        default: () => [],
      },
      miniBookmakerReviews: {
        type: MiniBookmakerReviewSchema,
        default: () => [],
      },
      tableContent: {
        type: TableContentSchema,
        default: () => ({ data: [] }),
      },
      textImages: {
        type: TextImageSchema,
        default: () => [],
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const LOCALES: string[] = [];

const formatSegment = (segment: string) =>
  segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

ModelSchema.statics.getBreadcrumbs = async function (
  slug: string,
  breadcrumbTitle: string,
) {
  if (
    slug === "index" ||
    !breadcrumbTitle?.length ||
    slug === `${LOCALES.find((l) => slug.startsWith(l))}`
  )
    return [];

  const cleaned = slug.replace(/^\/+|\/+$/g, "");
  const segments = cleaned.split("/").filter(Boolean);

  if (segments.length === 0) return [];

  const breadcrumbs: { title: string; slug: string }[] = [];

  const firstSegment = segments[0];
  const hasLocale = firstSegment && LOCALES.includes(firstSegment);

  const homeSlug = hasLocale ? `${firstSegment}` : "index";
  const homePost = await this.findOne(
    { slug: homeSlug, isDeleted: false },
    { breadcrumbTitle: 1 },
  ).lean();

  breadcrumbs.push({
    title: homePost?.breadcrumbTitle || "",
    slug: hasLocale ? `/${firstSegment}` : "/",
  });

  const contentSegments = hasLocale ? segments.slice(1) : segments;
  let cumulativePath = hasLocale ? `/${firstSegment}` : "";

  for (let i = 0; i < contentSegments.length; i++) {
    const segment = contentSegments[i];
    cumulativePath += `/${segment}`;
    const isLast = i === contentSegments.length - 1;

    if (isLast) {
      breadcrumbs.push({ title: breadcrumbTitle, slug: cumulativePath });
    } else {
      const post = await this.findOne(
        { slug: cumulativePath.replace(/^\//, ""), isDeleted: false },
        { breadcrumbTitle: 1 },
      ).lean();

      breadcrumbs.push({
        title: post?.breadcrumbTitle || formatSegment(segment!),
        slug: cumulativePath,
      });
    }
  }

  return breadcrumbs;
};

ModelSchema.index({ slug: 1, title: 1, isDeleted: 1 });

ModelSchema.plugin(uniqueValidator, {
  message:
    "Please update ‘{PATH}’ with a unique value or review the archived table.",
});

export const PostModel: IPostModel = model<IPostDocument, IPostModel>(
  EntityModel.Post,
  ModelSchema,
);
