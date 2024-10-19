"use client";

import { createContext, useState, useContext, useEffect } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { User } from "firebase/auth";
import { AuthContextType } from "@/type";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const [isLoadingUser, setIsLoadinguser] = useState<boolean>(true);
  const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(true);
  const [lastMessage, setLastMessage] = useState<any[]>([]);

  const signinWithGoogle = () => {
    const provider = new GoogleAuthProvider().setCustomParameters({
      prompt: "select_account",
    });
    signInWithPopup(auth, provider)
      .then((result) => {})
      .catch((error) => {});
  };

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    setCurrentUser,
    signinWithGoogle,
    logout,
    showChatBox,
    setShowChatBox,
    isLoadingUser,
    lastMessage,
    isLoadingLogin,
    setIsLoadingLogin,
    setLastMessage,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadinguser(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
