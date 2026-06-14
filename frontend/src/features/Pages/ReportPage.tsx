import React from "react";
import ControlledInput from "../../Components/ControlledInput";
import ControlledTextArea from "../../Components/ControlledTextArea";
import { useMutation } from "@tanstack/react-query";
import { axios } from "../../lib/axios";

export default function ReportPage() {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const updateMutation = useMutation(
    ["report"],
    (reportInfo: {
      title: string;
      content: string;
    }): Promise<{ title: string; content: string }> => {
      return axios.post(`report/`, reportInfo);
    },
    {
      onSuccess: (data) => {
        alert(
          "Tack för din rapport! Vi kommer att titta på det så snart som möjligt.",
        );
        window.location.reload();
        // localStorage.setItem("token", data.token);
        // navigate("/");
      },
    },
  );
  return (
    <div className="h-full w-full justify-center flex items-center px-2">
      <div className="mb-8 border-black/20 border-1 rounded-md bg-white p-4 md:shadow-md w-full max-w-2xl ">
        <h2 className="text-2xl font-medium tracking-tight mb-4">Felanmälan</h2>
        <ControlledInput
          label="Titel"
          value={title}
          setter={(value) => {
            setTitle(value);
          }}
          placeholder=""
          size="medium"
          labelClassnames="text-lg font-medium "
        />
        <div className="my-4"></div>
        <ControlledTextArea
          label="Ange vad som är fel"
          onChange={(value) => {
            setContent(value);
          }}
          value={content}
        />

        <div className="flex justify-end mt-4 w-full">
          <button
            className="px-4 py-2 bg-p-100 text-white rounded-md hover:bg-p-200"
            onClick={() => {
              if (title.trim() === "" || content.trim() === "") {
                alert("Vänligen fyll i både titel och beskrivning.");
                return;
              }
              if (content.length > 1000) {
                alert("Beskrivningen får inte överstiga 1000 tecken.");
                return;
              }

              if (content.length < 10) {
                alert("Beskrivningen måste vara minst 10 tecken lång.");
                return;
              }

              updateMutation.mutate({ title, content });
            }}
          >
            Skicka
          </button>
        </div>
      </div>
    </div>
  );
}
