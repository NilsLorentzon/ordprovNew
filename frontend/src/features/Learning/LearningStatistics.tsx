import React, { useContext } from "react";
import { axios } from "../../lib/axios";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { useQuery } from "@tanstack/react-query";

export default function LearningStatistics() {
    const { auth } = useContext(AuthContext);
  const {
    data: statisticsData,
    isLoading: isStatisticsDataLoading,
    refetch: refetchStatisticsData,
  } = useQuery({
    queryKey: ["learning", "statistics"],
    queryFn: (): Promise<any> => {
      if (!auth.email) {
        return new Promise<any>((resolve) => {
          resolve([]);
        });
      }
      return axios.get(`learning/statistics`);
    },
  });

  console.log("statisticsData", statisticsData);
  return <div>LearningStatistics</div>;
}
