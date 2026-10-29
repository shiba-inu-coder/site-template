export interface ISeoUsecasePublic {
  getRefLink(slug: string): Promise<string>;

  countRefClick(method: string): Promise<void>;

  getSitemap(): Promise<
    {
      loc: string;
      lastmod: Date;
      changefreq: string;
      priority: number;
    }[]
  >;
}
