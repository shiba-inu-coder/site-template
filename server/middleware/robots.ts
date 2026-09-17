import type { H3Event } from "h3";
import { defineEventHandler } from "h3";
import { SettingModel } from "#sg/adapters/repository/mongodb/models/setting.model";

// Слой 3 защиты `/ui` от роботов (см. `docs/ui.md`, «/ui page»): дописан
// отдельной группой `User-agent`, а не поиском/правкой текста оператора —
// `robotsTXT` в базе редактируется свободно, и `/ui` обязан остаться
// недоступным независимо от того, что там написано.
const UI_DISALLOW_BLOCK = "User-agent: *\nDisallow: /ui\n";

export default defineEventHandler(async (event: H3Event) => {
  const { req } = event.node;
  const { res } = event.node;

  if (req.url === "/robots.txt") {
    const settings = await SettingModel.find();
    const robotsTXT = settings.length
      ? (settings[0].toJSON() as ISetting).robotsTXT
      : "";

    res.setHeader("Content-Type", "text/plain");
    res.end(`${robotsTXT}\n\n${UI_DISALLOW_BLOCK}`);
  }
});
