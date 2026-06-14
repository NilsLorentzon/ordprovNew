import { useMutation } from "@tanstack/react-query";
import { axios } from "../../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { routePaths } from "../../routes/MainRoutes";
import ControlledInput from "../../Components/ControlledInput";
import React from "react";

export const signout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};
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
        localStorage.setItem("token", data.token);
        navigate("/");
        window.location.reload();
      },
    },
  );

  // const login = () => {
  //   updateMutation.mutate({ email, password });
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the browser's default page refresh
    updateMutation.mutate({ email, password });
  };

  return (
    <div className="h-full w-full justify-center flex items-center px-2">
      <div className="mb-8 border-black/20 border-1 rounded-md bg-white p-4 md:shadow-md">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between max-w-md w-full "
        >
          <div className="flex items-center gap-4 flex-wrap">
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
          <button
            aria-label="Logga in"
            className="mt-8 px-4 py-2 bg-p-100 text-white text-2xl rounded-lg hover:bg-p-200 hover:scale-[102%] transition duration-300"
            type="submit"
          >
            Logga in
          </button>
          <div className="my-2"></div>
          <div className="w-full flex justify-end">
            <Link to={`${routePaths.signup}`} className=" ">
              <button
                aria-label="Gå till registreringssidan"
                className="underline text-black"
              >
                Skapa nytt konto
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
