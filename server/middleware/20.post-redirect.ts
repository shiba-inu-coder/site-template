import { SettingModel } from "#sg/adapters/repository/mongodb/models/setting.model";

export default defineEventHandler(async (event) => {
  const settings = await SettingModel.find();

  const data = settings?.length
    ? (settings[0].toJSON() as ISetting)
    : undefined;

  if (data) {
    const redirectRoute = data.redirectsRoutes.find(
      (route) => route.oldRoute === event.path,
    );
    if (redirectRoute) {
      await sendRedirect(event, redirectRoute.newRoute, 301);
    }
  }
});
