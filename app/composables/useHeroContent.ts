import {
  findShortcodeMarkers,
  removeShortcodeMarkers,
} from "#shared/utils/shortcode-markers";

const HERO_MARKERS = [
  "rating-strip",
  "biography-writer",
  "text-image",
  "button-ref",
] as const;

/**
 * Что из лида статьи уезжает в хиро-полосу. Решение принимается один раз и
 * читается двумя: `HeroLayout` рисует перенесённое, `PostSections` рисует лид
 * уже без этого и без своего H1 — иначе заголовок и полоса оценки оказались бы
 * на странице дважды.
 */
export const useHeroContent = () => {
  const { sections, getShortcode } = usePost();
  const { frame } = useUiTheme();
  const siteConfig = useSiteConfig();

  const style = computed(() => frame.value.hero || "none");

  const enabled = computed(
    () => style.value !== "none" && sections.value.length > 0,
  );

  const leadTitle = computed(() => sections.value[0]?.title || "");

  const markers = computed(() =>
    enabled.value
      ? findShortcodeMarkers(sections.value[0]?.body || "").filter((marker) =>
          (HERO_MARKERS as readonly string[]).includes(marker.name),
        )
      : [],
  );

  const markerOf = (name: (typeof HERO_MARKERS)[number]) =>
    markers.value.find((marker) => marker.name === name) || null;

  const rating = computed(() => markerOf("rating-strip"));
  const biography = computed(() => markerOf("biography-writer"));

  // Блок «картинка + текст» уезжает в хиро только вместе с картинкой: в
  // текстовом блоке переносить нечего, а из лида он бы при этом пропал.
  const photoMarker = computed(() =>
    style.value === "photo" ? markerOf("text-image") : null,
  );

  const photo = computed(() => {
    if (!photoMarker.value) {
      return null;
    }

    const img = getShortcode({
      uniqId: photoMarker.value.uniqId,
      shortcode: "textImages",
    })?.data.img;

    return img?.path ? { src: img.path, alt: img.alt } : null;
  });

  // Кнопка шапки старше статейной: она есть на каждой странице сайта, а
  // `button-ref` лида — только там, где его поставил редактор.
  const button = computed(() =>
    siteConfig.value.layout.header.cta.label ? null : markerOf("button-ref"),
  );

  const movedNames = computed(() =>
    [
      rating.value,
      biography.value,
      photo.value ? photoMarker.value : null,
      button.value,
    ]
      .filter(Boolean)
      .map((marker) => marker!.name),
  );

  const leadBody = computed(() =>
    removeShortcodeMarkers(sections.value[0]?.body || "", movedNames.value),
  );

  return {
    enabled,
    style,
    leadTitle,
    leadBody,
    rating,
    biography,
    photo,
    button,
  };
};
