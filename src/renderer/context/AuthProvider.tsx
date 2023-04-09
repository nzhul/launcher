import { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { User } from '../../models/users/user';
import { LoginResult } from '../..//models/users/loginResult';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthProvider: React.FC<{ children: any }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<User>();

  const setUserInfo = (loginResult: LoginResult) => {
    localStorage.setItem('user-info', JSON.stringify(loginResult));
    window.API.setWindowSize(1280, 832, true, 1000, 640);
    setIsAuthenticated(true);
    setToken(loginResult.tokenString);
    setUser(loginResult.user);
  };

  const tokenExpired = (token: string) => {
    const jwt = jwtDecode<JwtPayload>(token);
    return jwt.exp! < Date.now() / 1000;
  };

  const logout = () => {
    window.API.setWindowSize(365, 508, false, 365, 508);
    setIsAuthenticated(false);
    localStorage.removeItem('user-info');
    setToken(undefined);
    setUser(undefined);
    navigate('/login');
  };

  useEffect(() => {
    const userInfoString = localStorage.getItem('user-info');

    if (!userInfoString) {
      window.API.setWindowSize(365, 508, false, 365, 508);
      navigate('/login');
      return;
    }

    const userInfo: LoginResult = JSON.parse(userInfoString);

    if (tokenExpired(userInfo.tokenString)) {
      setUserInfo({
        tokenString: undefined,
        user: undefined,
      });

      navigate('/login');
    } else {
      window.API.setWindowSize(1280, 832, true, 1000, 640);
      navigate('/');
      setUserInfo(userInfo);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        token: token,
        user: user,
        setUserInfo: setUserInfo,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
