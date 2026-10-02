/**
 * id заголовка секции: свой якорь из панели, иначе uid. Тот же выбор делает
 * панель, когда собирает HTML страницы и пункты оглавления, — разойдись они,
 * оглавление вело бы на id, которого на странице нет.
 */
export const sectionAnchorId = (
  section: { uid?: string; anchor?: string } | null | undefined,
): string => section?.anchor || section?.uid || "";
