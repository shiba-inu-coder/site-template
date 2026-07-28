const SETTINGS_MODULE_NAME = "settings";

export const useSettings = () => {
  const { $api } = useNuxtApp();

  const state = useState<ISettingPublic>(SETTINGS_MODULE_NAME, () =>
    shallowRef({ redirectsRoutes: [], headerLinks: [] }),
  );

  const redirectsRoutes = computed(() => state.value.redirectsRoutes);
  const headerLinks = computed(() => state.value.headerLinks);

  const setSettings = (data: ISettingPublic) => {
    const { redirectsRoutes, headerLinks } = data;

    state.value.redirectsRoutes = redirectsRoutes;
    state.value.headerLinks = headerLinks;
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
