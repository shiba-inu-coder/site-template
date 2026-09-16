// Вариант блока приходит тремя путями: поле записи в базе, тема сайта
// (`uiTheme.variants.*`), дефолт самого блока. Из базы может прилететь что
// угодно — значение старой эпохи ("1"), удалённый вариант, опечатка, — поэтому
// выигрывает первый кандидат, который блок действительно умеет нарисовать, а не
// первый непустой.
export const pickVariant = <T extends string>(
  allowed: readonly T[],
  fallback: T,
  ...candidates: (string | undefined | null)[]
): T => {
  for (const candidate of candidates) {
    if (candidate && (allowed as readonly string[]).includes(candidate)) {
      return candidate as T;
    }
  }

  return fallback;
};
