import { useMutation } from "@tanstack/react-query";
import { axios } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import ControlledInput from "../Components/ControlledInput";
import React from "react";

export default function SignupPage() {
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const [error, setError] = React.useState<
    { message: string; path: string[] }[] | null
  >(null);

  const pathStringToFieldName = (path: string[]) => {
    if (path[0] === "userName") return "Användarnamn";
    if (path[0] === "email") return "Email";
    if (path[0] === "password") return "Lösenord";
    return path.join(".");
  };
  const updateMutation = useMutation(
    ["authentication", "signup"],
    (signupInfo: {
      userName: string;
      email: string;
      password: string;
    }): Promise<{ token: string }> => {
      return axios.post(`authentication/signup`, signupInfo);
    },
    {
      onSuccess: () => {
        navigate("/login");
        // localStorage.setItem("token", data.token);
      },
      onError: (error: any) => {
        console.error("Login failed", error);
        setError(
          error.response?.data?.error || "Signup failed. Please try again.",
        );
      },
    },
  );

  const signup = () => {
    updateMutation.mutate({ email, password, userName });
  };

  return (
    <div className="h-full w-full justify-center flex items-center px-2">
      <div className="mb-8 border-black/20 border-1 rounded-md bg-white p-4 md:shadow-md full">
        <div className="flex flex-col justify-between max-w-md w-full ">
          <div className="flex items-center gap-4 flex-wrap">
            <ControlledInput
              label="Användarnamn"
              value={userName}
              setter={setUserName}
              placeholder="Ange ditt användarnamn"
              size="medium"
              labelClassnames="text-lg font-medium "
            />
            <ControlledInput
              label="Email"
              value={email}
              setter={setEmail}
              placeholder="Ange din email"
              size="medium"
              labelClassnames="text-lg font-medium "
            />
            <ControlledInput
              label="Lösenord"
              value={password}
              setter={setPassword}
              placeholder="Ange ditt lösenord"
              size="medium"
              labelClassnames="text-lg font-medium "
              inputType="password"
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 rounded mt-4">
              {error.map((err, index) => (
                <div key={index} className="my-2">
                  {pathStringToFieldName(err.path)}: {err.message}
                </div>
              ))}
            </div>
          )}
          <button
            aria-label="Skapa konto"
            className="mt-8 px-4 py-2 bg-p-100 text-white text-2xl rounded-lg hover:bg-p-200 hover:scale-[102%] transition duration-300"
            onClick={signup}
          >
            Skapa konto
          </button>
          <div className="my-2"></div>
        </div>
      </div>
    </div>
  );
}
