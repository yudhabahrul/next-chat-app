"use client";

import { useRouter } from "next/navigation";
import Groups from "@/components/Groups";
import ChatBox from "@/components/ChatBox";
import GroupInfo from "@/components/GroupInfo";
import { Suspense, useContext, useEffect } from "react";
import { AuthContextType } from "@/type";
import { AuthContext } from "@/context/AuthContext";
import ReactLoading from "react-loading";
import useWindowDimensions from "@/hooks/useWindowDimensions";

const Home = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext) as AuthContextType;
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
  }, [currentUser]);

  return (
    <Suspense
      fallback={
        <ReactLoading
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
          type="bubbles"
          color="#608ce9"
          height={(width as number) < 639 ? "25%" : "15%"}
          width={(width as number) < 639 ? "25%" : "15"}
        />
      }
    >
      <div className="flex h-screen overflow-hidden">
        <Groups />
        <ChatBox />
        <GroupInfo />
      </div>
    </Suspense>
  );
};

export default Home;
