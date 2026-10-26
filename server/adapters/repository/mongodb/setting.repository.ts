import { AppError } from "#sg/lib/app-error";
import { SettingModel } from "./models/setting.model";
import { CasinoModel } from "./models/casino.model";
import { pruneRefs } from "#shared/utils/ref-link";

export class SettingRepository implements ISettingRepository {
  async getPublic() {
    try {
      const settings = await SettingModel.findOneOrCreate();
      // `toJSON`, а не сам документ: `strings` объявлена схемой без единого
      // объявленного пути (`strict: false`), и дерево переводов доезжает
      // наружу только развёрнутым в обычный объект.
      const data = settings.toJSON() as ISetting;
      const refs = await this.liveRefs(data.refs);

      return {
        redirectsRoutes: data.redirectsRoutes,
        brand: data.brand,
        layout: data.layout,
        strings: data.strings,
        navigation: data.navigation ?? null,
        refs,
        uiTheme: data.uiTheme,
        draft: data.draft ?? null,
      } satisfies ISettingStoredPublic;
    } catch (e: any) {
      throw AppError.handleMongoError(e);
    }
  }
  // Выбор, ссылающийся на снятое казино, отдаём как невыбранный.
  private async liveRefs(refs?: SiteRefs | null) {
    if (!refs) {
      return null;
    }

    const slugs = new Set(
      [
        refs.defaultSlug,
        ...Object.values(refs.blocks ?? {}),
        ...Object.values(refs.buttons ?? {}),
      ].filter(Boolean),
    );

    if (!slugs.size) {
      return pruneRefs(refs, []);
    }

    const alive = await CasinoModel.find({
      slug: { $in: [...slugs] },
      isDeleted: false,
    })
      .select("slug")
      .lean();

    return pruneRefs(
      refs,
      alive.map((casino) => casino.slug),
    );
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
