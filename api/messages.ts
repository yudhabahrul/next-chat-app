import axios from "axios";

export const fetchLastMessage = async (groupId: string) => {
  const response = await axios.get(
    `https://chat-app-gamma-virid.vercel.app/api/${groupId}/last-message`
  );
  console.log(response.data);
  return response.data;
};
