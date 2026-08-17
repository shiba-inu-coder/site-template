import { AppError } from "#sg/lib/app-error";
import { PostModel } from "./models/post.model";
import type { PipelineStage } from "mongoose";
import { MongoAdvancedSearch } from "#sg/utils/mongo-advanced-search";

export class PostRepository implements IPostRepository {
  async getAll(query: AdvancedSearchQuery, isDeleted: boolean) {
    const { parseQuery, getSearch, getSort, getPagination } =
      MongoAdvancedSearch;
    const { page, limit, sort, search, searchKeys } = parseQuery(query);

    const SEARCH = getSearch(search, searchKeys);

    const MATCH = {
      $match: {
        ...SEARCH,
        isDeleted,
      },
    };

    const SORT: PipelineStage.Sort = getSort(sort);

    const pipeline: (
      | PipelineStage.Project
      | PipelineStage.Sort
      | PipelineStage.Match
      | PipelineStage.Lookup
      | PipelineStage.Unwind
    )[] = [
      MATCH,
      {
        $project: {
          title: 1,
          slug: 1,
          isActive: 1,
          entity: 1,
          entityModel: 1,
          updatedAt: 1,
          isDeleted: 1,
        },
      },
      SORT,
    ];

    try {
      const items = await PostModel.aggregate(pipeline).exec();

      return getPagination({
        page,
        limit,
        items,
      });
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }
  async getById(id: string): Promise<IPost> {
    try {
      return await PostModel.findById(id).lean<IPost>().orFail();
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }
  async getBySlug(slug: string) {
    try {
      const res = await PostModel.findOne({ slug })
        .populate([
          {
            path: "banner.entity",
            select: "title logo _id slug",
          },
          {
            path: "entity",
            select: "-refLink -createdAt -updatedAt -updatedAt  -_id",
            populate: [
              {
                path: "bonuses",
                select: "title text",
              },
              {
                path: "gameTypes",
                select: "title order",
              },
              {
                path: "softwareProviders",
                select: "title logo",
              },
              {
                path: "paymentMethods",
                select: "title logo",
              },
            ],
          },
          {
            path: "entityBonus",
            select: "title text",
          },
          {
            path: "shortcodesConfig.casinoRatings.data.data",
            populate: [
              {
                path: "entity",
                select:
                  "-refLink -_id -createdAt -updatedAt -bonusCode -wageringRequirements -bonus -website -owner -closedYear",
                populate: [
                  {
                    path: "gameTypes",
                    select: "title order",
                  },
                  {
                    path: "softwareProviders",
                    select: "title logo",
                  },
                  {
                    path: "paymentMethods",
                    select: "title logo",
                  },
                  {
                    path: "reviewPost",
                    select: "slug",
                  },
                ],
              },
              {
                path: "bonuses",
                select: "title text",
              },
            ],
          },
          {
            path: "shortcodesConfig.casinoBonuses.data.data",
            populate: [
              {
                path: "entity",
                select: "slug logo title",
              },
              {
                path: "bonuses",
                select: "title text wager minDeposit maxCashout",
              },
            ],
          },
          {
            path: "shortcodesConfig.bookmakerRatings.data.data",
            populate: [
              {
                path: "entity",
                select: "-refLink -_id -createdAt -updatedAt  -bonus",
                populate: [
                  {
                    path: "sports",
                    select: "title",
                  },
                  {
                    path: "paymentMethods",
                    select: "title logo",
                  },
                ],
              },
              {
                path: "bonuses",
                select: "title text",
              },
            ],
          },
          {
            path: "shortcodesConfig.bookmakerBonuses.data.data",
            populate: [
              {
                path: "entity",
                select: "slug logo title",
              },
              {
                path: "bonuses",
                select: "title text wager minDeposit maxCashout",
              },
            ],
          },
          {
            path: "shortcodesConfig.biographyWriters",
            populate: [
              {
                path: "data.data.writer",
                select: "fullName avatar position info username",
              },
            ],
          },
          {
            path: "shortcodesConfig.miniCasinoReviews",
            populate: [
              {
                path: "data.entity",
                select: "licence yearEstablished numberCasinosGame -_id",
                populate: [
                  {
                    path: "gameTypes",
                    select: "title -_id",
                  },
                  {
                    path: "paymentMethods",
                    select: "title -_id",
                  },
                ],
              },
              {
                path: "data.bonuses",
                select: "title text -_id",
              },
            ],
          },
          {
            path: "shortcodesConfig.miniBookmakerReviews",
            populate: [
              {
                path: "data.entity",
                select: "licence yearEstablished -_id",
                populate: [
                  {
                    path: "sports",
                    select: "title -_id",
                  },
                  {
                    path: "paymentMethods",
                    select: "title -_id",
                  },
                ],
              },
              {
                path: "data.bonuses",
                select: "title text -_id",
              },
            ],
          },
        ])
        .orFail();

      // @ts-expect-error IPostModel объявлен как голый Model<IPost>, а
      // getBreadcrumbs живёт только в ModelSchema.statics — в типе модели его
      // нет, поэтому вызов виден компилятору как обращение к несуществующему.
      const breadcrumbs = await PostModel.getBreadcrumbs(
        res.slug,
        res.breadcrumbTitle,
      );
      const post = res.toJSON<IPostBySlug>();
      return {
        ...post,
        breadcrumbs,
      };
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async getByEntityId(entity: string): Promise<IPost> {
    try {
      const res = await PostModel.findOne({ entity }).orFail();
      return res;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async create(input: InputPost): Promise<IPost> {
    try {
      const data = await PostModel.create(input);
      return data.toJSON({ getters: true });
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async update(id: string, input: InputPost): Promise<IPost> {
    try {
      return await PostModel.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      })
        .lean<IPost>()
        .orFail();
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async delete(id: string) {
    try {
      const res = await PostModel.findByIdAndDelete(id).orFail();
      return res;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }
  async updatePartial(
    id: string,
    updateData: Partial<InputPost>,
  ): Promise<IPost> {
    try {
      const res = await PostModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .lean<IPost>()
        .orFail();
      return res;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async getSitemap() {
    try {
      const posts = await PostModel.aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $project: {
            slug: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);
      const res = posts.map((item) => {
        return {
          loc: item.slug === "index" ? "/" : item.slug,
          lastmod: item.updatedAt,
          changefreq: "daily",
          priority: 0.8,
        };
      });

      return res;
    } catch (e: any) {
      throw AppError.handleMongoError(e);
    }
  }

  async getOptions(param?: { label: string; value: string }) {
    try {
      const labelField = param?.label || "title";
      const valueField = param?.value || "_id";
      const MATCH = {
        $match: {
          isActive: true,
        },
      };
      const items = await PostModel.aggregate<Option>([
        MATCH,
        {
          $project: {
            label: `$${labelField}`,
            value: `$${valueField}`,
            _id: 0,
          },
        },
      ]).exec();

      return items;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }
}
