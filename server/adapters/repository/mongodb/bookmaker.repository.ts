import { AppError } from "#sg/lib/app-error";
import type { ObjectId, PipelineStage } from "mongoose";
import { MongoAdvancedSearch } from "#sg/utils/mongo-advanced-search";
import { BookmakerModel } from "#sg/adapters/repository/mongodb/models/bookmaker.model";

export class BookmakerRepository implements IBookmakerRepository {
  async getAll(query: AdvancedSearchQuery, isDeleted: boolean) {
    const { parseQuery, getSearch, getSort, getPagination } =
      MongoAdvancedSearch;
    const { page, limit, sort, search, searchKeys } = parseQuery(query);

    const SORT = getSort(sort);

    const SEARCH = getSearch(search, searchKeys);

    const MATCH: PipelineStage.Match = {
      $match: {
        ...SEARCH,
        isDeleted,
      },
    };

    const pipeline = [
      MATCH,
      {
        $project: {
          title: 1,
          logo: 1,
          slug: 1,
          rating: 1,
          isDeleted: 1,
          updatedAt: 1,
        },
      },
      SORT,
    ];

    try {
      const items = await BookmakerModel.aggregate(pipeline).exec();

      const results = getPagination({
        page,
        limit,
        items,
      });

      return results;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async getOptions(param?: { label: string; value: string }) {
    try {
      const labelField = param?.label || "title";
      const valueField = param?.value || "slug";

      const items = await BookmakerModel.aggregate<Option>([
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

  async getById(id: string) {
    try {
      return await BookmakerModel.findById(id).lean<IBookmaker>().orFail();
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async getBySlug(slug: string) {
    try {
      return await BookmakerModel.findOne({ slug }).lean<IBookmaker>().orFail();
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async create(input: InputBookmaker) {
    try {
      const data = await BookmakerModel.create(input);
      const res: IBookmaker = data.toJSON({
        getters: true,
      });
      return res;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async update(id: string, input: InputBookmaker) {
    try {
      return await BookmakerModel.findByIdAndUpdate(
        id,
        { $set: input },
        {
          new: true,
          runValidators: true,
        },
      )
        .lean<IBookmaker>()
        .orFail();
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }
  async partialUpdate(id: string, input: Partial<InputBookmaker>) {
    try {
      return await BookmakerModel.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      })
        .lean<IBookmaker>()
        .orFail();
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async delete(id: string) {
    try {
      await BookmakerModel.findByIdAndDelete(id).orFail();
      return true;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }
  async archive(id: string) {
    try {
      await BookmakerModel.findByIdAndUpdate(id, {
        isDeleted: true,
      }).orFail();
      return true;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }
  async unarchive(id: string) {
    try {
      await BookmakerModel.findByIdAndUpdate(id, {
        isDeleted: false,
      }).orFail();
      return true;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async addBonus(casinoId: ObjectId, bonusId: ObjectId) {
    try {
      await BookmakerModel.findByIdAndUpdate(
        casinoId,
        { $push: { bonuses: bonusId } },
        { new: true, runValidators: true },
      )
        .lean<ICasino>()
        .orFail();
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async removeBonus(casinoId: ObjectId, bonusId: ObjectId) {
    try {
      await BookmakerModel.findByIdAndUpdate(
        casinoId,
        { $pull: { bonuses: bonusId } },
        { new: true, runValidators: true },
      )
        .lean<ICasino>()
        .orFail();
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }

  async getAllForShortcode() {
    try {
      const data = await BookmakerModel.find({ isDeleted: false })
        .select("title logo bonuses")
        .populate({
          path: "bonuses",
          select: "title text",
        })
        .lean<RatingBookmakersShortcode[]>()
        .orFail();

      return data;
    } catch (error: any) {
      throw AppError.handleMongoError(error);
    }
  }
}
