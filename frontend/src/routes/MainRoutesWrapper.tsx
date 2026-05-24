import { Suspense } from "react";
import { Outlet } from "react-router-dom";
// import { useOnlineStatus } from "../hooks/useOnlineStatus";
// import WarningIcon from "../assets/SVG/WarningIcon";
import { useQuery } from "@tanstack/react-query";
import MainMenu from "../MainMenu";

export default function MainRoutesWrapper() {
  //   const online = useOnlineStatus();
  //   const { data: systemStorage } = useQuery(
  //     ["systemStorage"],
  //     (): Promise<{
  //       message: string;
  //     }> => axios.get("system-storage"),
  //     {
  //       refetchInterval: 60000,
  //     },
  //   );
  return (
    <Suspense fallback={<div></div>}>
      <div className="h-full max-h-full">
        <div className="relative isolate h-full max-h-full min-h-full overflow-auto">
          <MainMenu>
            <Outlet />
          </MainMenu>
        </div>
        {/* {online === false && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-orange-400 px-4 py-2">
            <WarningIcon className="h-6 w-6 shrink-0 fill-black" />
            <p className="text-lg font-bold text-black">
              You are currently offline. Changes can not be saved and new data
              can not be fetched.
            </p>
          </div>
        )} */}
        {/* {systemStorage?.message && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-blue-400 px-4 py-2">
            <WarningIcon className="h-6 w-6 shrink-0 fill-black" />
            <p className="text-lg font-bold text-black">
              {systemStorage.message}
            </p>
          </div>
        )} */}
      </div>
    </Suspense>
  );
}
