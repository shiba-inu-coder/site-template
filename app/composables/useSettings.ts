import type { UiTheme } from "#shared/utils/ui-theme";

const SETTINGS_MODULE_NAME = "settings";

const emptySettings = (): ISettingPublic => ({
  redirectsRoutes: [],
  brand: null,
  layout: null,
  strings: null,
  uiTheme: null,
});

// Загрузку держит `app/plugins/ui-theme.ts`: он ходит в паблик-роут до
// рендера, иначе тема и меню доезжали бы уже после первой отрисовки.
export const useSettings = () => {
  const settings = useState<ISettingPublic>(
    SETTINGS_MODULE_NAME,
    emptySettings,
  );

  const redirectsRoutes = computed(() => settings.value.redirectsRoutes);
  const uiTheme = computed(() => settings.value.uiTheme);

  const setSettings = (data: Partial<ISettingPublic> | null | undefined) => {
    settings.value = { ...emptySettings(), ...(data || {}) };
  };

  const setUiTheme = (theme: UiTheme | null) => {
    settings.value = { ...settings.value, uiTheme: theme };
  };

  return {
    settings,
    redirectsRoutes,
    uiTheme,
    setSettings,
    setUiTheme,
  };
};
