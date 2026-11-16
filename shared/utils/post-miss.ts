// Редиректы панели живут в Traefik, и переход внутри SPA до него не доходит:
// ссылка на перенесённый адрес кончалась бы 404. Полная загрузка отдаёт адрес
// ноде. На сервере и при гидрации запрос уже был полным — там перезагрузка
// зациклилась бы. Обрыв сети и отменённый запрос — не «страницы нет».
export const postMissAction = (ctx: {
  isClient: boolean;
  isHydrating: boolean;
  statusCode?: number;
}): "reload" | "error" =>
  ctx.isClient && !ctx.isHydrating && ctx.statusCode === 404
    ? "reload"
    : "error";
