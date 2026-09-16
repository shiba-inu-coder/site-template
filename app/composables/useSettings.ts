import type { UiTheme } from "#shared/utils/ui-theme";

const SETTINGS_MODULE_NAME = "settings";

const emptySettings = (): ISettingPublic => ({
  redirectsRoutes: [],
  headerLinks: [],
  uiTheme: null,
});

// Загрузку держит `app/plugins/ui-theme.ts`: он ходит в паблик-роут до
// рендера, иначе тема доезжала бы уже после первой отрисовки.
export const useSettings = () => {
  const settings = useState<ISettingPublic>(
    SETTINGS_MODULE_NAME,
    emptySettings,
  );

  const redirectsRoutes = computed(() => settings.value.redirectsRoutes);
  const headerLinks = computed(() => settings.value.headerLinks);
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
    headerLinks,
    uiTheme,
    setSettings,
    setUiTheme,
  };
};
