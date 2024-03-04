"use client";

import { useRouter } from "next/navigation";
import Groups from "@/components/Groups";
import ChatBox from "@/components/ChatBox";
import GroupInfo from "@/components/GroupInfo";
import { useContext, useEffect } from "react";
import { AuthContextType } from "@/type";
import { AuthContext } from "@/context/AuthContext";

const Home = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
  }, [currentUser]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Groups />
      <ChatBox />
      <GroupInfo />
    </div>
  );
};

export default Home;
