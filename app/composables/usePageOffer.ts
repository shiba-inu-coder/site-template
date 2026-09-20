/**
 * Оффер страницы — то, что сайдбар показывает карточкой, а липкая панель
 * строкой: казино, о котором статья, его оценка и бонус. Отдельной записи под
 * это в статье нет, поэтому собирается из того, что на странице уже есть:
 * баннер (лого, название и текст казино) и полоса оценки. Запасной вариант —
 * кнопка шапки из конфига сайта.
 */
export const usePageOffer = () => {
  const { banner, ratingStrip } = usePost();
  const siteConfig = useSiteConfig();

  const cta = computed(() => siteConfig.value.layout.header.cta);

  const entity = computed(() => banner.value?.entity ?? null);

  const bonus = computed(() => banner.value?.text || "");

  const terms = computed(() => entity.value?.title || "");

  const buttonLabel = computed(
    () => cta.value.label || siteConfig.value.translates.playNow,
  );

  const buttonLink = computed(() => cta.value.link);

  const score = computed(() => ratingStrip.value.score || 0);

  // Кнопка в никуда хуже отсутствующей: без слага бренда `useFakeRefLink`
  // отдаёт корень сайта, и липкая панель вела бы на ту же страницу.
  const hasCta = computed(() =>
    Boolean(cta.value.link || siteConfig.value.site.brandSlug),
  );

  const hasOffer = computed(() =>
    Boolean(entity.value || bonus.value || score.value),
  );

  return {
    entity,
    bonus,
    terms,
    score,
    buttonLabel,
    buttonLink,
    hasCta,
    hasOffer,
  };
};
