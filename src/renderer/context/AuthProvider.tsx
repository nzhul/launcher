import { useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
