import { AppNitroCache } from "#sg/lib/app-cache";

// Из окружения флаг приходит строкой (NUXT_SETTINGS_DRAFT=true), из
// runtimeConfig по умолчанию — булевым.
const isDraftShown = (flag: unknown) => flag === true || flag === "true";

export class SettingUsecase implements ISettingUsecasePublic {
  constructor(private settingRepository: ISettingRepository) {}

  async getPublic() {
    const { value, volatile } = await AppNitroCache().setCacheSettingItem(() =>
      this.settingRepository.getPublic(),
    );

    const { TEMPLATE_VERSION, SETTINGS_DRAFT } = useRuntimeConfig();
    const settings = resolvePublicSettings(value, {
      showDraft: isDraftShown(SETTINGS_DRAFT),
    });

    // Версия образа не хранится в Mongo и не зависит от кеша настроек —
    // панель сверяет её отдельно от остального содержимого этого ответа.
    return {
      data: { ...settings, templateVersion: TEMPLATE_VERSION },
      volatile,
    };
  }
}
