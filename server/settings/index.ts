import { SettingRepository } from "#sg/adapters/repository/mongodb/setting.repository";
import { SettingUsecase } from "./setting.usecase";
import { SettingController } from "./setting.controller";

const settingRepo = new SettingRepository();
const settingUsecase = new SettingUsecase(settingRepo);
const settingController = new SettingController(settingUsecase);

export class SettingComposition {
  static GetPublic = settingController.getPublic;
  // Для внутренних вызовов (middleware) — тот же кеш, что у публичного API,
  // без накладных расходов defineEventHandler.
  static GetPublicSettings = () => settingUsecase.getPublic();
}
