import type { H3Event } from "h3";
import { defineEventHandler } from "h3";
import { SettingRepository } from "#sg/adapters/repository/mongodb/setting.repository";
export default defineEventHandler(async (event: H3Event) => {
  const { req } = event.node;

  if (req.url === "/sitemap.xml") {
    setHeader(event, "Content-Type", "application/xml");

    const settingRepository = new SettingRepository();

    const settings = await settingRepository.get();

    const externalSitemapUrl = settings.externalSitemapUrl || "";

    if (externalSitemapUrl) {
      const xml = await $fetch<string>(externalSitemapUrl, {
        responseType: "text",
      });

      const matches = xml.match(/<lastmod>(.*?)<\/lastmod>/g) ?? [];
      const lastmod =
        matches
          .map((m) => m.replace(/<\/?lastmod>/g, ""))
          .sort()
          .at(-1) ?? new Date().toISOString();

      return `<?xml version="1.0" encoding="UTF-8"?>
            <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              <sitemap>
                <loc>${externalSitemapUrl}</loc>
                <lastmod>${lastmod}</lastmod>
              </sitemap>
            </sitemapindex>
          `;
    }
  }
});
