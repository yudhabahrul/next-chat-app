import axios from "axios";

export const fetchGroups = async () => {
  const response = await axios.get(
    "https://chat-app-gamma-virid.vercel.app/api/groups/getGroups"
  );

  return response.data;
};

export const addGroup = async (formData: FormData) => {
  const response = await axios.post(
    "https://chat-app-gamma-virid.vercel.app/api/groups/addGroup",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
