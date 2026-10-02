export type ISettingsPublic = ISetting;

export type ISettingRepository = {
  get(): Promise<ISetting>;
  setup(setting: ISetting): Promise<ISetting>;
  getPublic(): Promise<ISettingStoredPublic>;
};
export type ISettingUsecase = {
  get: () => Promise<ISetting>;
  setup(setting: ISetting): Promise<ISetting>;
};

export type ISettingUsecasePublic = {
  getPublic: () => Promise<{
    data: ISettingPublic & { templateVersion: string };
    volatile: boolean;
  }>;
};
