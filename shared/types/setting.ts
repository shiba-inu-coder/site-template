import type { Document, Model, ObjectId } from "mongoose";

export interface SettingRedirectRoute {
  oldRoute: string;
  newRoute: string;
}

type LinkItem<Id = ObjectId> = {
  type: "link";
  post: Id;
  title: string;
};

type GroupItem<Id = ObjectId> = {
  type: "group";
  title: string;
  children: LinkItem<Id>[];
};

type HeaderLink<Id = ObjectId> = LinkItem<Id> | GroupItem<Id>;

// Пропуск на стейджинг-сайт, выданный из панели. Наружу не отдаётся ни в
// одном ответе: `id` — это и есть секрет.
export interface SettingPreviewGrant {
  id: string;
  expiresAt: Date;
  createdAt: Date;
  createdBy: string;
}

export interface ISetting<Id = ObjectId> {
  robotsTXT: string;
  externalSitemapUrl: string;
  redirectsRoutes: SettingRedirectRoute[];

  headerLinks: HeaderLink<Id>[];
  previewGrants: SettingPreviewGrant[];
  uiTheme: UiTheme;
}

// `uiTheme` необязателен ровно здесь: сайт, который тему в панели ещё не
// заводил, читает цвета из собранного образа, и в ответе поля либо нет, либо
// оно пустой объект (см. `isUiThemeConfigured`).
export type ISettingPublic = Pick<
  ISetting<Pick<IPost, "title" | "slug">>,
  "redirectsRoutes" | "headerLinks"
> & {
  uiTheme?: UiTheme | null;
};

export interface ISettingDocument extends ISetting, Document {}

export interface ISettingModel extends Model<ISettingDocument> {
  findOneOrCreate(): Promise<ISettingDocument>;

  updateOrCreate(values: Partial<ISetting>): Promise<ISettingDocument>;
}
