import { DEFAULT_UI_THEME_DARK } from "#shared/utils/ui-theme";

const SETTINGS_MODULE_NAME = "settings";

export const useSettings = () => {
  const { $api } = useNuxtApp();

  const state = useState<ISettingPublic>(SETTINGS_MODULE_NAME, () =>
    shallowRef({
      redirectsRoutes: [],
      headerLinks: [],
      uiTheme: DEFAULT_UI_THEME_DARK,
    }),
  );

  const redirectsRoutes = computed(() => state.value.redirectsRoutes);
  const headerLinks = computed(() => state.value.headerLinks);

  const setSettings = (data: ISettingPublic) => {
    const { redirectsRoutes, headerLinks, uiTheme } = data;

    state.value.redirectsRoutes = redirectsRoutes;
    state.value.headerLinks = headerLinks;
    state.value.uiTheme = uiTheme;
  };

  const GET_SETTINGS = () => {
    return useAsyncData<ISettingPublic>(async (_nuxtApp) => {
      return await $api()<ISettingPublic>(`/api/v1/public/settings/settings`);
    });
  };

  return {
    GET_SETTINGS,
    headerLinks,
    setSettings,
    redirectsRoutes,
  };
};
