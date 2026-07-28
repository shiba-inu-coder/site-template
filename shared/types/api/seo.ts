export interface ISeoUsecasePublic {
  getRefLink(param: { type: RefLinkType; slug: string }): Promise<string>;

  getSitemap(): Promise<
    {
      loc: string;
      lastmod: Date;
      changefreq: string;
      priority: number;
    }[]
  >;
}
