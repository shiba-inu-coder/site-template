import { AppNitroCache } from "#sg/lib/app-cache";

export class SettingUsecase implements ISettingUsecasePublic {
  constructor(private settingRepository: ISettingRepository) {}

  async getPublic() {
    const { value, volatile } = await AppNitroCache().setCacheSettingItem(() =>
      this.settingRepository.getPublic(),
    );

    // Версия образа не хранится в Mongo и не зависит от кеша настроек —
    // панель сверяет её отдельно от остального содержимого этого ответа.
    return {
      data: { ...value, templateVersion: useRuntimeConfig().TEMPLATE_VERSION },
      volatile,
    };
  }
}
