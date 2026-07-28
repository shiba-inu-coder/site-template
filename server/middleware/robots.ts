import type { H3Event } from "h3";
import { defineEventHandler } from "h3";
import { SettingModel } from "#sg/adapters/repository/mongodb/models/setting.model";

export default defineEventHandler(async (event: H3Event) => {
  const { req } = event.node;
  const { res } = event.node;

  if (req.url === "/robots.txt") {
    const settings = await SettingModel.find();
    if (settings.length) {
      const item = settings[0].toJSON() as ISetting;
      res.end(item.robotsTXT);
    } else {
      res.setHeader("Content-Type", "text/plain");
      res.end("");
    }
  }
});
