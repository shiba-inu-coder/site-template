export const useFakeRefLink = (slug?: string) => {
  if (!slug) {
    return `/`;
  }

  // Слеш на конце обязателен: без него url_normalize сначала отдал бы
  // кэшируемый 301 на слеш-вариант и только потом — наш 302.
  return `/go/${slug}/`;
};
