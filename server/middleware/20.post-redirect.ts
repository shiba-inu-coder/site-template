import { SettingComposition } from "#sg/settings";
import { isSafeRelativeRedirect } from "#shared/utils/safe-redirect";

export default defineEventHandler(async (event) => {
  const data = await SettingComposition.GetPublicSettings();

  const redirectRoute = data?.redirectsRoutes.find(
    (route) => route.oldRoute === event.path,
  );

  if (redirectRoute && isSafeRelativeRedirect(redirectRoute.newRoute)) {
    await sendRedirect(event, redirectRoute.newRoute, 301);
  }
});
