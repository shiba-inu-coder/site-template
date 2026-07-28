import { AppError } from "#sg/lib/app-error";
import { SettingModel } from "./models/setting.model";

export class SettingRepository implements ISettingRepository {
  async getPublic() {
    try {
      const settings = await SettingModel.findOneOrCreate();
      const data = (await settings.populate({
        path: "headerLinks",
        populate: [
          {
            path: "post",
            select: "slug",
          },
          {
            path: "children",
            populate: [
              {
                path: "post",
                select: "slug",
              },
            ],
          },
        ],
      })) satisfies ISettingPublic;
      return {
        redirectsRoutes: data.redirectsRoutes,
        headerLinks: data.headerLinks,
      };
    } catch (e: any) {
      throw AppError.handleMongoError(e);
    }
  }
  async get() {
    try {
      const settings = await SettingModel.findOneOrCreate();
      return settings.toJSON() as ISetting;
    } catch (e: any) {
      throw AppError.handleMongoError(e);
    }
  }
  async setup(body: ISetting) {
    try {
      const settings = await SettingModel.updateOrCreate(body);
      return settings.toJSON() as ISetting;
    } catch (e: any) {
      throw AppError.handleMongoError(e);
    }
  }
}
