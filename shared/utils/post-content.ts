/**
 * Панель собирает `content` и для поста с секциями — та же статья одним HTML.
 * Рисует его только страница без секций (`BasePostView`), и приоритетную
 * картинку в нём ищут тоже только тогда. Посту с секциями он в ответе — вторая
 * копия статьи в payload.
 */
export const postNeedsContent = (post: {
  sections?: readonly unknown[] | null;
}) => !post.sections?.length;

export const withoutUnusedContent = <
  T extends { content?: string; sections?: readonly unknown[] | null },
>(
  post: T,
): T => {
  if (postNeedsContent(post)) {
    return post;
  }

  const { content: _, ...rest } = post;

  return rest as T;
};
