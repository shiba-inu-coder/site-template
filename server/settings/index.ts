import { SettingRepository } from "#sg/adapters/repository/mongodb/setting.repository";
import { SettingUsecase } from "./setting.usecase";
import { SettingController } from "./setting.controller";

const settingRepo = new SettingRepository();
const settingUsecase = new SettingUsecase(settingRepo);
const settingController = new SettingController(settingUsecase);

export class SettingComposition {
  static GetPublic = settingController.getPublic;
}
