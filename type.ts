import { User } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";

export interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  signinWithGoogle: () => void;
  logout: () => Promise<void>;
  showChatBox: boolean;
  setShowChatBox: Dispatch<SetStateAction<boolean>>;
  setIsLoadingLogin: Dispatch<SetStateAction<boolean>>;
  isLoadingUser: boolean;
  lastMessage: any[];
  setLastMessage: Dispatch<SetStateAction<any[]>>;
  isLoadingLogin: boolean;
}
