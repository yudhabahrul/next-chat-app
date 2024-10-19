import { fetchLastMessage } from "@/api/messages";
import { Group } from "@/type";
import { useQueries } from "@tanstack/react-query";

export const useGetLastMessage = (groups: Group[]) => {
  return useQueries({
    queries: (groups || []).map((group: Group) => ({
      queryKey: ["lastMessage", group._id],
      queryFn: () => fetchLastMessage(group._id),
      enabled: !!group._id,
    })),
  });
};
