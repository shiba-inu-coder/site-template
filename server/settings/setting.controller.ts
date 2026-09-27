import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";
import { markCacheVolatile } from "#sg/lib/app-cache";

export class SettingController {
  constructor(private settingUsecase: ISettingUsecasePublic) {}

  getPublic = defineEventHandler({
    handler: async (e) => {
      const log = AppLogger("handler.setting.getPublic");
      try {
        const { data, volatile } = await this.settingUsecase.getPublic();

        if (volatile) {
          markCacheVolatile(e);
        }

        log.info("Fetched public settings successfully");
        return data;
      } catch (error: any) {
        log.error("Failed to fetch public settings", {
          error: error.message,
          stack: error.stack,
        });
        throw AppError.ClientError(error);
      }
    },
  });
}
