import { useQuery } from "@tanstack/react-query";
import { fetchGroups } from "../api/groups";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });
};
