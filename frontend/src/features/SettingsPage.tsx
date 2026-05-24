import React from "react";
import ControlledSelect from "../Components/ControlledSelect";
import ControlledSelectMultiple from "../Components/ControlledSelectMultiple";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-md">
      {/* <div className=" max-w-2xl mb-8 border-p-200/80 border-2 rounded-md bg-white p-4 md:shadow-md"> */}
        <h2 className="text-4xl tracking-tight font-medium mb-4 text-black">
          Quiz-inställningar
        </h2>

        <div className="w-full flex gap-4">
          <ControlledSelect
            label="Antal frågor"
            options={[
              { label: "10", value: 10 },
              { label: "20", value: 20 },
              { label: "50", value: 50 },
            ]}
            value={10}
            onChange={(option, action) => {
              console.log("Selected option:", option);
              console.log("Action meta:", action);
            }}
          />
          <ControlledSelect
            label="Ordlista"
            options={[
              { label: "Alla ord", value: "all" },
              { label: "Tidigare högskoleprov", value: "hp" },
              { label: "Gamla ordprovslistan", value: "oldOrdprov" },
            ]}
            value={"all"}
            onChange={(option, action) => {
              console.log("Selected option:", option);
              console.log("Action meta:", action);
            }}
          />
        </div>
        <div className="my-4"></div>
        <ControlledSelectMultiple
          label="Tillåtna ordklasser"
          options={[
            { label: "Substantiv", value: "noun" },
            { label: "Verb", value: "verb" },
            { label: "Adjektiv", value: "adjective" },
            { label: "Adverb", value: "adverb" },
          ]}
          value={[
            { label: "Substantiv", value: "noun" },
            { label: "Verb", value: "verb" },
            { label: "Adjektiv", value: "adjective" },
            { label: "Adverb", value: "adverb" },
          ]}
          onChange={(option, action) => {
            console.log("Selected option:", option);
            console.log("Action meta:", action);
          }}
        />
      </div>
    // </div>
  );
}
