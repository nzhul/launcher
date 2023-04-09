import { User } from './user';

export interface LoginResult {
  tokenString: string;
  user: User;
}
