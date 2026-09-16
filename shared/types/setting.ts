import type { Document, Model } from "mongoose";

export interface SettingRedirectRoute {
  oldRoute: string;
  newRoute: string;
}

// Пропуск на стейджинг-сайт, выданный из панели. Наружу не отдаётся ни в
// одном ответе: `id` — это и есть секрет.
export interface SettingPreviewGrant {
  id: string;
  expiresAt: Date;
  createdAt: Date;
  createdBy: string;
}

export interface ISetting {
  robotsTXT: string;
  externalSitemapUrl: string;
  redirectsRoutes: SettingRedirectRoute[];

  brand: SiteBrand;
  layout: SiteLayout;
  strings: SiteStrings;

  previewGrants: SettingPreviewGrant[];
  uiTheme: UiTheme;
}

// Всё, что приходит сайту в рантайме, необязательно: сайт, которому панель
// ещё не писала ни бренда, ни темы, рисует нейтральный шаблон из образа.
export type ISettingPublic = Pick<ISetting, "redirectsRoutes"> & {
  brand?: DeepPartial<SiteBrand> | null;
  layout?: DeepPartial<SiteLayout> | null;
  strings?: DeepPartial<SiteStrings> | null;
  uiTheme?: UiTheme | null;
};

export interface ISettingDocument extends ISetting, Document {}

export interface ISettingModel extends Model<ISettingDocument> {
  findOneOrCreate(): Promise<ISettingDocument>;

  updateOrCreate(values: Partial<ISetting>): Promise<ISettingDocument>;
}
