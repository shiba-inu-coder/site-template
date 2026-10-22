/**
 * Баннер первого экрана страницы — то, что видит и стандартный `PostHeroLayout`,
 * и свой `brand/Hero.vue`: плашка, бонус, картинка и кнопка. Данные лежат в
 * `banner` страницы (панель правит их во вкладке «Баннер»), бонус и ссылка
 * кнопки — те же, что у липкой панели (`usePageOffer`). Нет картинки и нет
 * бонуса — `hasHero` ложь, и рисовать нечего.
 */
export const usePageHero = () => {
  const { banner } = usePost();
  const offer = usePageOffer();

  const ribbon = computed(() => banner.value?.ribbon || "");

  const img = computed(() => {
    const picture = banner.value?.img;

    return picture?.path ? picture : null;
  });

  const buttonLabel = computed(
    () => banner.value?.buttonText || offer.buttonLabel.value,
  );

  const hasHero = computed(() => Boolean(img.value || offer.bonus.value));

  return {
    ribbon,
    bonus: offer.bonus,
    img,
    buttonLabel,
    buttonLink: offer.buttonLink,
    hasCta: offer.hasCta,
    hasHero,
  };
};
