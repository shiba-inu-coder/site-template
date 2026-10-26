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

// Меню шапки, ссылки и текст подвала, которые пишет только форма панели; на
// сайте они перекрывают `brand/site.json` (см. applyNavigation).
export interface SiteNavigation {
  headerLinks: { label: string; link: string }[];
  footerLinks: FooterLink[];
  footerTitle: string;
  footerBody: string;
}

// Какое казино ведёт реф-кнопка; пишет только панель. Ключи блоков и кнопок
// — `shared/constants/ref-buttons.ts` и `brand/refs.json`.
export interface SiteRefs {
  defaultSlug: string;
  blocks: Record<string, string>;
  buttons: Record<string, string>;
}

export interface ISetting {
  robotsTXT: string;
  externalSitemapUrl: string;
  redirectsRoutes: SettingRedirectRoute[];

  brand: SiteBrand;
  layout: SiteLayout;
  strings: SiteStrings;
  navigation?: SiteNavigation | null;
  refs?: SiteRefs | null;

  previewGrants: SettingPreviewGrant[];
  uiTheme: UiTheme;
  draft?: ISettingDraft | null;
}

// Неопубликованное оформление из панели. Наружу не отдаётся никогда: стенд
// получает его уже наложенным на опубликованное (`overlaySettingsDraft`).
export interface ISettingDraft {
  brand?: DeepPartial<SiteBrand> | null;
  layout?: DeepPartial<SiteLayout> | null;
  strings?: DeepPartial<SiteStrings> | null;
  uiTheme?: UiTheme | null;
}

// Всё, что приходит сайту в рантайме, необязательно: сайт, которому панель
// ещё не писала ни бренда, ни темы, рисует нейтральный шаблон из образа.
export type ISettingPublic = Pick<ISetting, "redirectsRoutes"> & {
  brand?: DeepPartial<SiteBrand> | null;
  layout?: DeepPartial<SiteLayout> | null;
  strings?: DeepPartial<SiteStrings> | null;
  navigation?: DeepPartial<SiteNavigation> | null;
  refs?: DeepPartial<SiteRefs> | null;
  uiTheme?: UiTheme | null;
};

// То, что репозиторий отдаёт usecase'у: публичная часть плюс черновик.
export type ISettingStoredPublic = ISettingPublic & {
  draft?: ISettingDraft | null;
};

export interface ISettingDocument extends ISetting, Document {}

export interface ISettingModel extends Model<ISettingDocument> {
  findOneOrCreate(): Promise<ISettingDocument>;

  updateOrCreate(values: Partial<ISetting>): Promise<ISettingDocument>;
}
