import { useEffect } from "react";

export const ERROR_TEXT =
  "Ordprov.com verkar ha crashat. Försök att ladda om sidan, eller kontakta supporten på nils.lorentzon@outlook.com om ingen av knapparna nedan fungerar.";
export default function ErrorFallback() {
  return (
    <div role="alert" className="h-full p-8">
      <h2 className="text-lg ">{ERROR_TEXT}</h2>
      <div className="my-4"></div>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-p-100 rounded hover:bg-p-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          // text="Reload Website"
          onClick={() => window.location.assign(window.location.origin)}
        >
          Ladda om sidan
        </button>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-p-100 rounded hover:bg-p-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          // go to /
          onClick={() => window.location.assign("/")}
        >
          Till startsida
        </button>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-p-100 rounded hover:bg-p-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          // text="Reload Website"
          onClick={() => window.location.assign("/felrapport")}
        >
          felrapport
        </button>
      </div>
    </div>
  );
}
