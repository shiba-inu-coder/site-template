export type IAuthUsecase = {
  login({
    email,
    password,
    fingerprint,
  }: {
    email: string;
    password: string;
    fingerprint: string;
  }): Promise<IToken>;
  logout(refreshToken: string): Promise<void>;
  refresh(refreshToken: string, fingerprint: string): Promise<IToken>;
};
