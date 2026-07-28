export interface ISessionRepository {
  saveSession: (data: {
    userId: string;
    refreshToken: string;
    fingerprint: string;
    expiresIn: Date;
  }) => Promise<void>;
  removeSession: (refreshToken: string) => Promise<boolean>;
  findSession: (refreshToken: string) => Promise<ISession>;
  findSessionByUserIdAndDelete(userId: string): Promise<boolean>;
}
