import type { H3Event } from "h3";
import { defineEventHandler } from "h3";
import { SettingModel } from "#sg/adapters/repository/mongodb/models/setting.model";

export default defineEventHandler(async (event: H3Event) => {
  const { req } = event.node;
  const { res } = event.node;

  if (req.url === "/robots.txt") {
    const settings = await SettingModel.find();
    const robotsTXT = settings.length
      ? (settings[0].toJSON() as ISetting).robotsTXT
      : "";

    res.setHeader("Content-Type", "text/plain");
    res.end(robotsTXT);
  }
});
