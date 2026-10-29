// Копия в панели: `shared/utils/ref-clicks.js`. Расходятся молча: окно панели
// показало бы сутки, границы которых не совпадают с границами счётчика.
export const refClickDay = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

// Считаем только настоящий переход: GET (HEAD и префетч мимо), флаг включён
// панелью, домен известен. Пустой домен записал бы строку «|день».
export const shouldCountRefClick = ({
  method,
  enabled,
  domain,
}: {
  method: string;
  enabled: boolean | undefined;
  domain: string | undefined;
}) => method === "GET" && enabled === true && Boolean(domain);

// Составной `_id`: в проде `autoIndex` выключен, и уникальный индекс по паре
// (домен, день) не построился бы — `_id` уникален всегда.
export const refClickKey = (domain: string, day: string) => `${domain}|${day}`;
