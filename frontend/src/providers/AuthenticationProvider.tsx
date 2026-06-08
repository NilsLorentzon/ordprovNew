import { jwtDecode } from "jwt-decode";
import { createContext, useState, useMemo } from "react";

import type { SetStateAction, Dispatch, ReactNode } from "react";
export interface Auth {
  email: string;
  role: Roles;
  userName: string;
  userId: string;
}
export type Roles = "admin" | "user";
export interface Token {
  token: string;
}

interface authenticationContext {
  auth: Auth;
  setAuth: Dispatch<SetStateAction<Auth>>;
}

const defaultValue = {
  auth: {
    email: "",
    role: "user" as const,
    userName: "",
    userId: "",
  },
  setAuth: () => console.log("wrap in provider"),
};

const AuthContext = createContext<authenticationContext>(defaultValue);

const getAuthFromLocalStorage = () => {
  const rawToken = localStorage.getItem("token");
  if (rawToken) {
    const storedToken = jwtDecode<{
      email: string;
      exp: number;
      role: Roles;
      userName: string;
      userId: string;
    }>(rawToken);

    // console.log("storedToken", storedToken);
    if (Date.now() < storedToken.exp * 1000) {
      return {
        email: storedToken.email,
        role: storedToken.role,
        userName: storedToken.userName,
        userId: storedToken.userId,
      };
    }
  }
  return {
    email: "",
    role: "user" as const,
    userName: "", 
    userId: "",
  };
};
interface Props {
  children: ReactNode;
}
function AuthProvider({ children }: Props) {
  let { email, role, userName, userId } = getAuthFromLocalStorage();
  const [auth, setAuth] = useState<Auth>({
    email,
    role,
    userName,
    userId,
  });

  const value = useMemo(
    () => ({
      auth,
      setAuth,
    }),
    [auth],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
