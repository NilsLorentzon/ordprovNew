import React from "react";
import FocusControlledInput from "../Components/FocusControlledInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "../lib/axios";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const updateMutation = useMutation(
    ["authentication", "signup"],
    (signupInfo: {
      name: string;
      lastName: string;
      email: string;
      password: string;
    }): Promise<{ token: string }> => {
      return axios.post(`authentication/signup`, signupInfo);
    },
    {
      onSuccess: (data) => {
        console.log("Login successful", data);
        navigate("/login");
        // localStorage.setItem("token", data.token);
      },
    },
  );

  const signup = () => {
    updateMutation.mutate({ email, password, name, lastName });
  };

  return (
    <div className="h-full w-full justify-center flex items-center ">
      <div className="mb-8 border-p-200/80 border-2 rounded-md bg-white p-4 md:shadow-md full">
        <div className="flex flex-col justify-between max-w-md w-full ">
          <div className="flex items-center gap-4 flex-wrap">
            <FocusControlledInput
              label="Förnamn"
              value={name}
              setter={setName}
              placeholder="Ange ditt förnamn"
              size="large"
              labelClassnames="text-xl font-medium "
            />
            <FocusControlledInput
              label="Efternamn"
              value={lastName}
              setter={setLastName}
              placeholder="Ange ditt efternamn"
              size="large"
              labelClassnames="text-xl font-medium "
            />
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
