import { jwtDecode } from "jwt-decode";
import { createContext, useState, useMemo } from "react";

import type { SetStateAction, Dispatch, ReactNode } from "react";
export interface Auth {
  email: string;
  role: Roles;
  name: string;
  userId: string;
  lastName: string;
}
// export interface AuthExtended {
//   email: string;
//   role: Roles;
//   name: string;
//   userId: string;
//   lastName: string;
// }
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
    name: "",
    lastName: "",
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
      name: string;
      lastName: string;
      userId: string;
    }>(rawToken);

    console.log("storedToken", storedToken);
    if (Date.now() < storedToken.exp * 1000) {
      return {
        email: storedToken.email,
        role: storedToken.role,
        name: storedToken.name,
        lastName: storedToken.lastName,
        userId: storedToken.userId,
      };
    }
  }
  return {
    email: "",
    role: "user" as const,
    name: "",
    lastName: "",
    userId: "",
  };
};
interface Props {
  children: ReactNode;
}
function AuthProvider({ children }: Props) {
  let { email, role, name, lastName, userId } = getAuthFromLocalStorage();
  const [auth, setAuth] = useState<Auth>({
    email,
    role,
    name,
    lastName,
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
