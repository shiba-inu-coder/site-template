import { resolveHeroContent } from "#shared/utils/hero-content";

/**
 * Решение принимается один раз и читается несколькими: `HeroLayout` рисует
 * перенесённое, `PostSections` рисует лид уже без этого и без своего H1,
 * `PostTextImage` — без картинки, уехавшей в хиро. Иначе заголовок, автор и
 * картинка оказались бы на странице дважды.
 */
export const useHeroContent = () => {
  const { sections, textImages } = usePost();
  const { frame } = useUiTheme();
  const siteConfig = useSiteConfig();

  const content = computed(() =>
    resolveHeroContent({
      style: frame.value.hero,
      sections: sections.value,
      textImages: textImages.value,
      headerCtaLabel: siteConfig.value.layout.header.cta.label,
    }),
  );

  return {
    content,
    enabled: computed(() => content.value.enabled),
    style: computed(() => content.value.style),
    leadTitle: computed(() => content.value.title),
    titleId: computed(() => content.value.titleId),
    leadBody: computed(() => content.value.leadBody),
    biography: computed(() => content.value.biography),
    photo: computed(() => content.value.photo),
    button: computed(() => content.value.button),
  };
};
