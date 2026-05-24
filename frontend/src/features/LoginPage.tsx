import React from "react";
import FocusControlledInput from "../Components/FocusControlledInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { routePaths } from "../routes/MainRoutes";

export const signout = () => {
  localStorage.removeItem("token");
  window.location.reload();
}
export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const updateMutation = useMutation(
    ["authentication", "login"],
    (loginInfo: {
      email: string;
      password: string;
    }): Promise<{ token: string }> => {
      return axios.post(`authentication/login`, loginInfo);
    },
    {
      onSuccess: (data) => {
        console.log("Login successful", data);
        localStorage.setItem("token", data.token);
        navigate("/quiz");
        window.location.reload();
      },
    },
  );

  const login = () => {
    updateMutation.mutate({ email, password });
  };

  return (
    <div className="h-full w-full justify-center flex items-center ">
      <div className="mb-8 border-p-200/80 border-2 rounded-md bg-white p-4 md:shadow-md">
        <div className="flex flex-col justify-between max-w-md w-full ">
          <div className="flex items-center gap-4 flex-wrap">
            <FocusControlledInput
              label="Email"
              value={email}
              setter={setEmail}
              placeholder="Ange din email"
              size="large"
              labelClassnames="text-xl font-medium "
            />
            <FocusControlledInput
              label="Lösenord"
              value={password}
              setter={setPassword}
              placeholder="Ange ditt lösenord"
              size="large"
              labelClassnames="text-xl font-medium "
              inputType="password"
            />
          </div>
          <button
            className="mt-8 px-6 py-3 bg-p-100 text-white text-2xl rounded-lg hover:bg-p-200 hover:scale-[102%] transition duration-300"
            onClick={login}
          >
            Logga in
          </button>
          <div className="my-2"></div>
          <div className="w-full flex justify-end">
            <Link to={`${routePaths.signup}`} className=" ">
              <button className="underline text-black">Skapa nytt konto</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
