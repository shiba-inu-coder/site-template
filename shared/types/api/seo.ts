export interface ISeoUsecasePublic {
  getRefLink(slug: string): Promise<string>;

  getSitemap(): Promise<
    {
      loc: string;
      lastmod: Date;
      changefreq: string;
      priority: number;
    }[]
  >;
}
