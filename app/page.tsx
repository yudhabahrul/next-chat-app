"use client";

import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/type";
import { useContext, useEffect } from "react";
import ReactLoading from "react-loading";
import useWindowDimensions from "@/hooks/useWindowDimensions";

const Loading = () => {
  const { currentUser, isLoadingUser } = useContext(
    AuthContext
  ) as AuthContextType;
  const router = useRouter();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!isLoadingUser) {
      if (currentUser) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    }
  }, [isLoadingUser, currentUser]);

  return (
    <section className="w-full h-screen grid place-content-center overflow-hidden">
      <ReactLoading
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 pb-28"
        type="bubbles"
        color="#608ce9"
        // height={(width as number) < 500 ? "7%" : "20%"}
        // width={(width as number) < 500 ? "7%" : "20%"}
      />
    </section>
  );
};

export default Loading;
