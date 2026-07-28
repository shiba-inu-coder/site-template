import { AppNitroCache } from "#sg/lib/app-cache";

export class SettingUsecase implements ISettingUsecasePublic {
  constructor(private settingRepository: ISettingRepository) {}

  async getPublic() {
    return AppNitroCache().setCacheSettingItem("settings", () =>
      this.settingRepository.getPublic(),
    );
  }
}
