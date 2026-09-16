import { AppError } from "#sg/lib/app-error";
import { SettingModel } from "./models/setting.model";

export class SettingRepository implements ISettingRepository {
  async getPublic() {
    try {
      const settings = await SettingModel.findOneOrCreate();
      // `toJSON`, а не сам документ: `strings` объявлена схемой без единого
      // объявленного пути (`strict: false`), и дерево переводов доезжает
      // наружу только развёрнутым в обычный объект.
      const data = settings.toJSON() as ISetting;

      return {
        redirectsRoutes: data.redirectsRoutes,
        brand: data.brand,
        layout: data.layout,
        strings: data.strings,
        uiTheme: data.uiTheme,
      } satisfies ISettingPublic;
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
