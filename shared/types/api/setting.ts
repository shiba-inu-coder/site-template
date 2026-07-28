export type ISettingsPublic = ISetting;

export type ISettingRepository = {
  get(): Promise<ISetting>;
  setup(setting: ISetting): Promise<ISetting>;
  getPublic(): Promise<ISettingPublic>;
};
export type ISettingUsecase = {
  get: () => Promise<ISetting>;
  setup(setting: ISetting): Promise<ISetting>;
};

export type ISettingUsecasePublic = {
  getPublic: () => Promise<ISettingPublic>;
};
