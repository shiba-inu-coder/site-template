export interface IUserRepository {
  getUserByEmailWithPassword(email: string): Promise<IUser>;
  getUserById(id: string): Promise<IUser>;
}
