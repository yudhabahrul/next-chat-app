"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/type";
import ReactLoading from "react-loading";

const Login = () => {
  const { currentUser, signinWithGoogle, isLoadingLogin, setIsLoadingLogin } =
    useContext(AuthContext) as AuthContextType;
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.replace("/home");
    }
  }, [currentUser]);

  useEffect(() => {
    const isClickLogin = localStorage.getItem("isClickLogin");

    setTimeout(() => {
      localStorage.removeItem("isClickLogin");
      setIsLoadingLogin(false);
    }, 7000);

    if (!isClickLogin) {
      setIsLoadingLogin(false);
    }
  }, []);

  const handleLogin = async () => {
    try {
      await signinWithGoogle();
      localStorage.setItem("isClickLogin", "true");
    } catch (error) {}
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isLoadingLogin ? (
        <ReactLoading
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 pb-28"
          type="bubbles"
          color="#608ce9"
        />
      ) : (
        <>
          <div className="absolute top-36 sm:bottom-0 sm:top-[70%] left-28 sm:left-0 w-[23rem] h-80 blur-3xl -rotate-12 bg-blue-200 rounded-full"></div>
          <div className="absolute top-10 left-[50%] w-48 h-80 blur-3xl bg-pink-200 rounded-full"></div>
          <div className="absolute top-36 right-16 w-64 h-80 blur-3xl bg-green-200 rounded-full"></div>
          <div className="absolute top-[30%] left-[44%] w-48 h-80 blur-3xl bg-cyan-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full sm:flex sm:items-center 2xl:grid 2xl:place-content-center backdrop-blur-xl bg-[rgba(185,210,247,0.4)]">
            <div className="w-96 sm:mx-auto sm:w-[90%] h-96 rounded-[2rem] bg-[rgba(255,255,255,0.5)]">
              <Image
                className="w-72 h-60 mx-auto mt-5"
                src="/login.png"
                width={290}
                objectFit="cover"
                height={240}
                alt="login-image"
              />
              <div
                onClick={handleLogin}
                className="relative flex items-center cursor-pointer py-2 px-[0.825rem] bg-white w-[90%] mx-auto rounded-3xl mt-9"
              >
                <Image
                  className="w-7 h-7"
                  src="/ic_google.png"
                  width={30}
                  objectFit="cover"
                  height={230}
                  alt="ic_google"
                />
                <p className="text-slate-600 ml-3 text-[0.825rem] font-bold">
                  Login With Google
                </p>
                <MdArrowForwardIos className="absolute top-1/2 text-gray-300 -translate-y-1/2 right-3" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
