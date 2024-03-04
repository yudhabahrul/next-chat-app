"use client";

import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useState, useEffect, useContext, Suspense } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase";
import { v4 as uuid } from "uuid";
import {
  IoSearchOutline,
  IoCloseOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { GrDocumentImage } from "react-icons/gr";
import { IoMdAdd, IoMdImage } from "react-icons/io";
import Link from "next/link";
import ReactLoading from "react-loading";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { secondsToDate, getAMPMFromISOString } from "@/helper";
import { AuthContextType } from "@/type";
import { AuthContext } from "@/context/AuthContext";

const Groups = () => {
  const router = useRouter();
  const path = usePathname();
  const { setShowChatBox, currentUser, logout, lastMessage } = useContext(
    AuthContext
  ) as AuthContextType;
  const searchParams = useSearchParams();
  const id = searchParams.get("chats");
  const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sendImage, setSendImage] = useState<File | null>(null);
  const [nameGroup, setNameGroup] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchGroup, setSearchGroup] = useState<string>("");
  const [listGroups, setListGroups] = useState<any[]>([]);
  const [createIsLoading, setCreateIsLoading] = useState<boolean>(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const q = query(collection(db, "groups"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listGroup: any = [];
      querySnapshot.forEach((doc) => {
        listGroup.push({ ...doc.data(), id: doc.id });
      });
      setGroups(listGroup);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const listLastMessage: any[] = [];

      for (const val of groups) {
        const q = query(
          collection(db, val?.id.toString() as string),
          orderBy("createdAt")
        );
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;
        if (docs.length > 0) {
          const lastDoc = docs[docs.length - 1];
          const lastMessage = { ...lastDoc.data() };
          listLastMessage.push(lastMessage);
        } else {
          listLastMessage.push(null);
        }
      }
      setMessages(listLastMessage);
    };

    fetchMessages();
  }, [groups, lastMessage]);

  const handleLogout = () => {
    localStorage.removeItem("isClickLogin");
    logout();
  };

  useEffect(() => {
    const filterGroup = groups.filter((group, _) =>
      group?.nameGroup.toLowerCase().includes(searchGroup.toLowerCase())
    );
    setListGroups(filterGroup);
  }, [searchGroup, groups]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e?.target?.files?.[0];

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
      setSendImage(selectedFile);
    }
  };

  const handleNameGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameGroup(e.target?.value);
  };

  const handleSearchGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchGroup(e.target?.value);
  };

  const handleCreateGroup = async () => {
    setCreateIsLoading(true);
    if (sendImage && nameGroup) {
      const storageRef = ref(storage, uuid());

      uploadBytes(storageRef, sendImage).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          await addDoc(collection(db, "groups"), {
            nameGroup,
            image: url,
            createdAt: serverTimestamp(),
          });
        });
        setShowCreateGroup(false);
        setCreateIsLoading(false);
        setSelectedImage(null);
        setSendImage(null);
        setNameGroup("");
      });
    } else {
      if (!sendImage) {
        alert("Foto group belum diunggah");
      } else {
        alert("Nama group belum ditulis");
      }
      setCreateIsLoading(false);
    }
  };

  return (
    <Suspense
      fallback={
        <ReactLoading
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
          type="bubbles"
          color="#608ce9"
          height={"15%"}
          width={"15%"}
        />
      }
    >
      <section className="relative h-screen bg-gray-100 pt-6 flex-[1]">
        <div className="h-[19%] sm:h-[16%] px-4">
          <div className="flex items-center">
            <div className="w-1/6">
              <Link href={(width as number) < 639 ? "/about" : ""}>
                <Image
                  className="rounded-full w-11 h-11 object-cover object-top"
                  src={currentUser?.photoURL as string}
                  width={44}
                  objectFit="cover"
                  height={44}
                  alt="Picture of the author"
                />
              </Link>
            </div>
            <div className="w-3/4 leading-4 ml-2 sm:ml-0">
              <p className="font-semibold leading-4 sm:leading-4 text-blue-500 text-sm sm:text-base -ml-[1.5px]">
                {currentUser?.displayName}
              </p>
              <p className="text-gray-600 text-xs sm:text-[0.8rem]">
                Programmer
              </p>
            </div>
            <ul className="flex items-center space-x-[10px]">
              <li>
                <AiOutlineUsergroupAdd
                  onClick={() => setShowCreateGroup(true)}
                  title="Add Group"
                  className="text-[#949393] -mt-4 text-xl cursor-pointer"
                />
              </li>
              <li>
                <IoLogOutOutline
                  onClick={handleLogout}
                  title="Logout"
                  className="text-[#8d8c8c] -mt-4 text-xl cursor-pointer sm:text-lg"
                />
              </li>
            </ul>
          </div>
          <div className="relative w-full h-8 sm:h-9 my-7 overflow-hidden">
            <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 ml-[10px] stroke-gray-400" />
            <input
              onChange={handleSearchGroup}
              type="text"
              placeholder="Search group"
              className="w-full h-full outline-none rounded-2xl p-[3px] pl-8 text-sm placeholder:text-gray-400 placeholder:text-[0.8rem]"
            />
          </div>
        </div>
        {isLoading ? (
          <ReactLoading
            className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
            type="bubbles"
            color="#608ce9"
            height={"15%"}
            width={"15%"}
          />
        ) : groups.length >= 1 ? (
          <ul className="scroll overflow-y-auto w-full h-[calc(100%_-_19%)] sm:h-[calc(100%_-_15%)] sm:pb-1">
            {listGroups.map((group, idx) => {
              return (
                <li
                  key={idx}
                  onClick={() => {
                    (width as number) < 639 ? null : setShowChatBox(true);
                  }}
                >
                  <Link
                    href={
                      (width as number) < 639
                        ? `/chat/${group?.id}`
                        : `/home?chats=${group?.id}`
                    }
                    className={`flex w-full items-center py-[0.7rem] pl-4 cursor-pointer ${
                      group?.id === id ? "bg-gray-200" : ""
                    } hover:bg-gray-200 border-b border-gray-200 last:border-b-0`}
                    scroll={false}
                  >
                    <div className="w-1/6 sm:w-[13.5%]">
                      <Image
                        className="rounded-full w-10 h-10 object-cover"
                        src={group?.image}
                        width={70}
                        objectFit="cover"
                        height={70}
                        alt="Picture of the author"
                      />
                    </div>
                    <div className="w-[64%] sm:w-[70%] mt-[3px]">
                      <p className="font-semibold leading-4 text-blue-500 text-[0.8rem] sm:text-sm sm:ml-1 truncate">
                        {group?.nameGroup}
                      </p>
                      {messages[idx]?.image && !searchGroup ? (
                        <IoMdImage className="text-[#9b9a9a] -ml-[0.2rem] text-lg sm:ml-1" />
                      ) : (
                        <p
                          className={`text-gray-600 w-56 text-[0.7rem] ${
                            messages[idx] && !searchGroup ? "" : "invisible"
                          } sm:text-xs sm:ml-1 truncate`}
                        >
                          {messages[idx] ? messages[idx]?.message : "p"}
                        </p>
                      )}
                    </div>
                    {messages[idx]?.createdAt && !searchGroup && (
                      <p className="text-gray-700 -mt-3 text-[0.65rem]">
                        {`${secondsToDate(
                          messages[idx]?.createdAt?.seconds
                        ).getHours()}.${secondsToDate(
                          messages[idx]?.createdAt?.seconds
                        ).getMinutes()} ${getAMPMFromISOString(
                          secondsToDate(messages[idx]?.createdAt?.seconds)
                        )}`}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col justify-center items-center mt-20">
            <Image
              src="/no-group.png"
              className="w-40 h-40"
              width={160}
              height={160}
              alt="no-group"
            />
            <p className="text-sm text-slate-600">
              Belum ada group yang dibuat
            </p>
          </div>
        )}
        <div
          className={`fixed top-0 left-0 w-screen ${
            showCreateGroup ? "grid place-content-center" : "hidden"
          } h-screen bg-[rgba(0,0,0,0.75)] z-20`}
        >
          <div className="relative w-80 h-80 rounded-xl px-5 pt-4 bg-white sm:mx-10">
            <IoCloseOutline
              onClick={() => {
                setShowCreateGroup(false);
                setSelectedImage(null);
                setSendImage(null);
                setNameGroup("");
              }}
              className="absolute top-3 right-3 text-[1.35rem] text-gray-600 cursor-pointer"
            />
            <h2 className="text-blue-500 text-center text-xl mt-2">
              Create a group
            </h2>
            {createIsLoading && (
              <ReactLoading
                className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
                type="bubbles"
                color="#608ce9"
                height={"15%"}
                width={"15%"}
              />
            )}
            <div className="flex items-end space-x-4 mt-6">
              <div className="relative w-11 h-11">
                <input
                  className="absolute opacity-0 top-0 left-0 w-full h-12 opacity-1 z-10"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {selectedImage ? (
                  <div className="w-[120%]">
                    <Image
                      className="w-full h-11 object-cover rounded-full"
                      src={selectedImage as string}
                      width={80}
                      height={80}
                      alt="img-group"
                    />
                  </div>
                ) : (
                  <>
                    <GrDocumentImage className="text-[2.2rem] text-blue-300" />
                    <div className="absolute -right-2 -bottom-1 w-[1.3rem] h-[1.35rem] grid place-content-center bg-white rounded-full shadow-md shadow-slate-300">
                      <IoMdAdd className="text-blue-500" />
                    </div>
                  </>
                )}
              </div>
              <input
                className="outline-none h-8 placeholder:text-xs text-[0.8rem] border-blue-300 border-b-2 w-full pb-2"
                type="text"
                value={nameGroup}
                onChange={handleNameGroup}
                autoComplete="off"
                placeholder="Name group"
              />
            </div>
            <div className="absolute bottom-5 right-5 flex items-center space-x-2">
              <button
                onClick={() => {
                  setShowCreateGroup(false);
                  setSelectedImage(null);
                  setSendImage(null);
                  setNameGroup("");
                }}
                className="text-xs outline-none text-slate-500 py-2 px-4"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="text-xs text-white rounded-md outline-none py-2 px-4 bg-blue-500"
                type="button"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Groups;
