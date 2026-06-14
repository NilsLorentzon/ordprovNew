import React from "react";
import { axios } from "../../lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { AdminData } from "../../types/types";
import { dateFormatter } from "../../utilities/utilities";

export default function AdminPage() {
  const {
    data: adminData,
    isLoading: isAdminDataLoading,
    refetch: refetchAdminData,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: (): Promise<AdminData> => axios.get(`admin-dashboard`),
  });

  if (isAdminDataLoading || !adminData) {
    return <div></div>;
  }
  return (
    <div className="h-full lg:p-8 pt-16 w-full">
      <div className=" rounded-md p-4 m-auto shadow-md border border-black/20 bg-white max-w-2xl">
        {adminData.verifiedUsers.map((user) => (
          <div
            key={user.userId}
            className="border-b-0 border-gray-300 py-2 flex items-center gap-4 "
          >
            <div className="w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
              {user.email} ({user.userName})
            </div>

            {dateFormatter(new Date(user.lastRequest))}
          </div>
        ))}
      </div>
    </div>
  );
}
