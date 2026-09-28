import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";
import { themeFontFile } from "#sg/lib/theme-fonts";
import { isThemeFontPath } from "#shared/utils/theme-fonts";

export default defineEventHandler(async (e) => {
  const path = getRouterParam(e, "path");

  if (!isThemeFontPath(path)) {
    throw AppError.ClientError(AppError.NotFound());
  }

  let file: Buffer | null;

  try {
    file = await themeFontFile(path);
  } catch (error: any) {
    AppLogger("handler.themeFonts.file").error("Failed to fetch theme font", {
      error: error.message,
      path,
    });

    throw AppError.ClientError(AppError.New({ statusCode: "BAD_GATEWAY" }));
  }

  if (!file) {
    throw AppError.ClientError(AppError.NotFound());
  }

  setResponseHeaders(e, {
    "Content-Type": "font/woff2",
    "Cache-Control": "public, max-age=31536000, immutable",
  });

  return file;
});
