import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: () => false,
});

export default AuthContext;
