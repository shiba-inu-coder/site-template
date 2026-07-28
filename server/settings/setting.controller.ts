import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";

export class SettingController {
  constructor(private settingUsecase: ISettingUsecasePublic) {}

  getPublic = defineEventHandler({
    handler: async () => {
      const log = AppLogger("handler.setting.getPublic");
      try {
        const res = await this.settingUsecase.getPublic();
        log.info("Fetched public settings successfully");
        return res;
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
