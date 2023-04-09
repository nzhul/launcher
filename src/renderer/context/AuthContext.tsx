import { createContext } from 'react';
import { User } from '../..//models/users/user';
import { LoginResult } from '../..//models/users/loginResult';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User;
  token: string;
  setUserInfo: (loginResult: LoginResult) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: undefined,
  token: undefined,
  setUserInfo: () => {
    return;
  },
  logout: () => {
    return;
  },
});

export default AuthContext;
