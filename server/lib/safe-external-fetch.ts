import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * externalSitemapUrl приходит из настроек сайта в БД — тот же canal, что и
 * контент. Без резолва хоста строка вида "http://169.254.169.254/latest/..."
 * прошла бы как валидный http-URL и дотянулась бы до облачных метаданных
 * ноды, а не только до чужого домена.
 */
const isPrivateIp = (ip: string) => {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a === 0
    );
  }

  const lower = ip.toLowerCase();
  return (
    lower === "::1" ||
    lower.startsWith("fe80:") ||
    lower.startsWith("fc") ||
    lower.startsWith("fd")
  );
};

export const resolvesToPublicHost = async (url: string) => {
  let hostname: string;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    hostname = parsed.hostname;
  } catch {
    return false;
  }

  if (isIP(hostname)) {
    return !isPrivateIp(hostname);
  }

  try {
    const { address } = await lookup(hostname);
    return !isPrivateIp(address);
  } catch {
    return false;
  }
};

export const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
