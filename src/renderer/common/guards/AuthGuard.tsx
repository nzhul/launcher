import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const AuthGuard = ({ children }: any) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <></>;
  }

  return children;
};

export default AuthGuard;
