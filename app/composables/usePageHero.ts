import { resolveHeroImage } from "#shared/utils/hero-image";

/**
 * Баннер первого экрана страницы — то, что видит и стандартный `PostHeroLayout`,
 * и свой `brand/Hero.vue`: плашка, бонус, картинка и кнопка. Данные лежат в
 * `banner` страницы (панель правит их во вкладке «Баннер»), бонус и ссылка
 * кнопки — те же, что у липкой панели (`usePageOffer`). Нет картинки и нет
 * бонуса — `hasHero` ложь, и рисовать нечего. Страница без своей картинки
 * берёт общий баннер сайта (`settings.brand.banner`), с alt страницы поверх.
 */
export const usePageHero = () => {
  const { banner } = usePost();
  const offer = usePageOffer();
  const siteConfig = useSiteConfig();

  const ribbon = computed(() => banner.value?.ribbon || "");

  const img = computed(() =>
    resolveHeroImage(banner.value?.img, siteConfig.value.banner),
  );

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
