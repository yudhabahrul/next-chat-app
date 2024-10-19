import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGroup } from "../api/groups";
import { Dispatch, SetStateAction } from "react";

export const useAddGroup = (
  setShowCreateGroup: Dispatch<SetStateAction<boolean>>,
  setSelectedImage: Dispatch<SetStateAction<string | null>>,
  setSendImage: Dispatch<SetStateAction<File | null>>,
  setNameGroup: Dispatch<SetStateAction<string>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => addGroup(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setShowCreateGroup(false);
      setSelectedImage(null);
      setSendImage(null);
      setNameGroup("");
    },
    onError: (error: Error) => {
      console.error("Error:", error.message);
    },
  });
};
