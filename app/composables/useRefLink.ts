import { useFakeRefLink } from "#rc/composables/useFakeRefLink";
import { pickRefSlug, resolveRefSlug } from "#shared/utils/ref-link";

/**
 * Адрес реф-кнопки по выбору панели: кнопка → её блок → по умолчанию →
 * `brandSlug` → `/`. Для кнопок, которые рисуются в цикле, где композабл на
 * каждую не вызвать, — `useRefLinks()`.
 */
export const useRefLink = (
  key: MaybeRefOrGetter<string>,
  block: MaybeRefOrGetter<string> = "",
) => {
  const href = useRefLinks();

  return computed(() => href(toValue(key), toValue(block)));
};

/**
 * `fallbackHref` встаёт между выбором панели и `brandSlug`: явная ссылка
 * пункта меню остаётся запасной, а не главной.
 */
export const useRefLinks = () => {
  const { settings } = useSettings();
  const siteConfig = useSiteConfig();

  return (key: string, block = "", fallbackHref = "") => {
    const { refs } = settings.value;
    const brandSlug = siteConfig.value.site.brandSlug;

    if (fallbackHref) {
      const chosen = pickRefSlug(refs, { key, block });

      return chosen ? useFakeRefLink(chosen) : fallbackHref;
    }

    return useFakeRefLink(resolveRefSlug(refs, { key, block, brandSlug }));
  };
};
