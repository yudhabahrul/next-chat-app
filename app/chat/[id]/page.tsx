"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useContext } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { GoArrowLeft } from "react-icons/go";
import { v4 as uuid } from "uuid";
import { AiOutlineHeart, AiOutlineLoading3Quarters } from "react-icons/ai";
import { GoBell } from "react-icons/go";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { VscSmiley } from "react-icons/vsc";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { AuthContextType } from "@/type";
import { AuthContext } from "@/context/AuthContext";
import { DocumentData } from "firebase/firestore";
import { ref } from "firebase/storage";
import { storage } from "@/firebase";
import ReactLoading from "react-loading";
import { formatTime } from "@/helper";
import { useSocket } from "@/context/SocketContext";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const ChatGroup = ({ params }: { params: { id: string } }) => {
  const { currentUser } = useContext(AuthContext) as AuthContextType;
  const [messages, setMessages] = useState<any[]>([]);
  const [textMessage, setTextMessage] = useState<string>("");
  const [marginB, setMarginB] = useState<number>(59.2);
  const [detailGroup, setDetailGroup] = useState<DocumentData>();
  const refBottom = useRef<HTMLDivElement | null>(null);
  const refElChat = useRef<HTMLUListElement | null>(null);
  const refTextArea = useRef<HTMLTextAreaElement | null>(null);
  const refEmot = useRef<HTMLDivElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sendImage, setSendImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSend, setIsSend] = useState<boolean>(false);
  const [showEmot, setShowEmot] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const id = params.id;
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "https://chat-app-gamma-virid.vercel.app/api/messages"
        );
        setMessages(response.data);
      } catch (error) {}
    };

    fetchMessages();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleSendMessage = async () => {
    if (sendImage && textMessage) {
      setIsSend(true);
      const storageRef = ref(storage, uuid());
      if (showEmot) {
        setShowEmot(false);
      }
      if (socket) {
        const reader = new FileReader();
        reader.readAsDataURL(sendImage);
        reader.onloadend = async () => {
          const base64Image = reader.result;

          socket.emit(
            "sendMessage",
            {
              user: currentUser?.displayName,
              email: currentUser?.email,
              avatar: currentUser?.photoURL,
              text: textMessage,
              imageBuffer: base64Image,
              image: selectedImage,
              room: id,
            },
            () => {
              setIsSend(false);
              setSelectedImage(null);
              setSendImage(null);
              setTextMessage("");
            }
          );
        };
      }
    } else if (!sendImage && textMessage) {
      setIsSend(true);
      if (showEmot) {
        setShowEmot(false);
      }
      if (socket) {
        socket.emit(
          "sendMessage",
          {
            user: currentUser?.displayName,
            email: currentUser?.email,
            avatar: currentUser?.photoURL,
            text: textMessage,
            imageBuffer: null,
            image: null,
            room: id,
          },
          () => {
            setIsSend(false);
            setTextMessage("");
          }
        );
      }
    } else if (sendImage && !textMessage) {
      setIsSend(true);
      if (showEmot) {
        setShowEmot(false);
      }
      if (socket) {
        const reader = new FileReader();
        reader.readAsDataURL(sendImage);
        reader.onloadend = async () => {
          const base64Image = reader.result;

          socket.emit(
            "sendMessage",
            {
              user: currentUser?.displayName,
              email: currentUser?.email,
              avatar: currentUser?.photoURL,
              text: null,
              imageBuffer: base64Image,
              image: selectedImage,
              room: id,
            },
            () => {
              setIsSend(false);
              setSelectedImage(null);
              setSendImage(null);
            }
          );
        };
      }
    } else {
      if (showEmot) {
        setShowEmot(false);
      }
      alert("Belum ada pesan yg ditulis");
    }
    refTextArea.current?.style.setProperty("height", "2.5rem");
    setMarginB((refBottom?.current?.offsetHeight as number) + 16);
  };

  const auto_grow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "2.5rem";
    e.target.style.height = e.target.scrollHeight + "px";
    setMarginB((refBottom?.current?.offsetHeight as number) + 15);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e?.target?.files?.[0];

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
      setSendImage(selectedFile);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://chat-app-gamma-virid.vercel.app/api/${id}/messages`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
      setIsLoading(false);
    };

    const fetchDetailGroup = async () => {
      try {
        const response = await axios.get(
          `https://chat-app-gamma-virid.vercel.app/api/groups/${id}`
        );
        setDetailGroup(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (id) {
      fetchMessages();
      fetchDetailGroup();
    }
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (messageData) => {
        queryClient.invalidateQueries({
          queryKey: ["lastMessage", messageData?.groupId],
        });
        console.log("Pesan diterima dari server:", messageData);
        setMessages((prevMessages) => {
          if (Array.isArray(prevMessages)) {
            return [...prevMessages, messageData];
          } else {
            console.warn("prevMessages bukan array, inisialisasi ulang");
            return [messageData];
          }
        });
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket, queryClient]);

  useEffect(() => {
    if (marginB !== 59.2) {
      refElChat.current?.style.setProperty(
        "height",
        `calc(100% - (3.7rem + ${marginB}px))`
      );
      refElChat?.current?.style.setProperty("margin-bottom", `${marginB}px`);
      refEmot?.current?.style.setProperty("bottom", `${marginB}px`);
    }
  }, [marginB]);

  useEffect(() => {
    setTimeout(() => {
      refEmot?.current?.style.setProperty("bottom", `${marginB}px`);
    });
  }, [showEmot]);

  const handleInputMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextMessage(e.target.value);

    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <header className="fixed top-0 left-0 right-0 flex  justify-between border-b-2 bg-white z-50 border-gray-100 px-4 pl-3 h-[4.7rem] ">
        <GoArrowLeft
          onClick={() => router.back()}
          className="absolute top-1/2 -translate-y-1/2 text-2xl text-gray-400"
        />
        <div className="flex items-center ml-7 w-[70%]">
          <Image
            className="rounded-full w-9 h-9 object-cover object-top"
            src={detailGroup?.image}
            width={36}
            objectFit="cover"
            height={36}
            alt="group"
          />
          <p className="left-[4.5rem] font-semibold leading-4 text-blue-500 text-[0.975rem] ml-[0.55rem] w-4/5 truncate">
            {detailGroup?.nameGroup}
          </p>
        </div>
        <ul className="flex items-center space-x-3">
          <li>
            <IoSearchOutline className="text-xl text-gray-400 cursor-pointer" />
          </li>
          <li>
            <AiOutlineHeart className="text-xl text-gray-400 cursor-pointer" />
          </li>
          <li>
            <GoBell className="text-xl text-gray-400 cursor-pointer" />
          </li>
        </ul>
      </header>
      {showEmot && (
        <div ref={refEmot} className="absolute w-full bottom-[3.7rem] z-10">
          <Picker
            data={data}
            theme="dark"
            dynamicWidth="true"
            onEmojiSelect={(e: any) => {
              setTextMessage(textMessage + e.native);
              refEmot?.current?.style.setProperty("bottom", `${marginB}px`);
              refTextArea.current?.focus();
            }}
          />
        </div>
      )}
      {isLoading ? (
        <ReactLoading
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
          type="bubbles"
          color="#608ce9"
          height={"15%"}
          width={"15%"}
        />
      ) : messages.length > 0 ? (
        <ul
          ref={refElChat}
          className={`scroll relative overflow-y-auto w-full mt-[4.7rem] mb-[3.7rem] h-[calc(100%_-_8.4rem)] pb-4`}
        >
          {messages.map((msg, idx) => {
            return (
              <li
                key={idx}
                className={`flex items-start ${
                  currentUser?.email === msg?.email
                    ? "justify-end"
                    : "justify-start"
                } mt-4 px-3`}
              >
                {currentUser?.email !== msg?.email && (
                  <Image
                    className="rounded-full w-7 h-7 object-cover"
                    src={msg?.avatar}
                    width={36}
                    objectFit="cover"
                    height={36}
                    alt="Picture of the author"
                  />
                )}
                <div
                  className={`relative flex items-center ${
                    msg?.image ? " max-w-[70%]" : "max-w-[90%]"
                  } ${
                    currentUser?.email === msg?.email
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  } px-2 pt-2 rounded-[0.4rem] ${
                    currentUser?.email === msg?.email
                      ? "rounded-tr-none"
                      : "rounded-tl-none"
                  } ${
                    currentUser?.email !== msg?.email ? "pt-1" : ""
                  } ml-[0.35rem]`}
                >
                  <div>
                    {currentUser?.email !== msg?.email && (
                      <p className=" text-blue-500 text-xs font-semibold -mt-1">
                        ~ {msg?.user}
                      </p>
                    )}
                    {msg?.image && (
                      <Image
                        className={`w-full h-72 object-cover object-top mt-1 ${
                          msg?.message ? "" : "mb-6"
                        }`}
                        src={msg?.image}
                        width={300}
                        objectFit="cover"
                        height={320}
                        alt="Picture of the author"
                      />
                    )}
                    {msg?.text && (
                      <p
                        className={`text-sm ${
                          msg?.text.includes(" ") ? "" : "break-all"
                        } ${
                          currentUser?.email === msg?.email
                            ? "text-white"
                            : "text-slate-800"
                        } leading-[15px] ${
                          msg?.text.length >= 55 ? "pr-2 pb-4" : "pr-16 pb-2"
                        }  ${msg?.image ? "mt-2" : ""}`}
                      >
                        {msg?.text.toString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`absolute ${
                      currentUser?.email === msg?.email
                        ? "text-white"
                        : "text-slate-800"
                    } bottom-[1px] right-2 text-[0.675rem]`}
                  >
                    {!msg?.createdAt
                      ? "00.00"
                      : `${formatTime(msg?.createdAt)}`}
                  </span>
                </div>
              </li>
            );
          })}
          <div className="mt-1" ref={messagesEndRef}></div>
        </ul>
      ) : (
        <h1 className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-lg whitespace-nowrap text-slate-600">
          Belum ada percakapan
        </h1>
      )}
      {selectedImage && (
        <div className="fixed bottom-[10%] left-[0%] bg-[rgba(0,0,0,0.75)]">
          <Image
            src={selectedImage as string}
            className="w-44 h-24 object-contain"
            width={200}
            height={97}
            alt="m-image"
          />
          <div
            onClick={() => setSelectedImage(null)}
            className="absolute -top-3 -right-2 cursor-pointer w-6 h-6 bg-[rgba(0,0,0,0.75)] rounded-full grid place-content-center"
          >
            <IoCloseOutline className="text-lg text-white" />
          </div>
        </div>
      )}
      <div
        ref={refBottom}
        className="fixed bottom-0 left-0  right-0 bg-white flex items-center border-t-2 border-gray-100 px-1 pl-3 min-h-[3.7rem] max-h-36"
      >
        <div className="relative w-[93%]">
          <textarea
            ref={refTextArea}
            value={textMessage}
            className="w-full scroll-chat bg-gray-100 h-10 py-3 pr-20 leading-4 placeholder:text-slate-600 outline-none pl-4 text-[0.95rem] rounded-3xl max-h-36 resize-none"
            onInput={auto_grow}
            onChange={handleInputMessage}
            placeholder="Write something"
          />
          <ul className="absolute top-1/2 -translate-y-1/2 right-3 -mt-[2.7px] flex items-center space-x-3">
            <li>
              <input
                onChange={handleImageChange}
                className="absolute top-1/2 -translate-y-1/2 opacity-0 w-1/2"
                type="file"
                accept="image/*"
              />
              <MdOutlinePhotoCamera className="fill-gray-500 text-xl cursor-pointer" />
            </li>
            <li>
              <VscSmiley
                onClick={() => setShowEmot(!showEmot)}
                className="fill-gray-600 text-xl cursor-pointer"
              />
            </li>
          </ul>
        </div>
        {isSend ? (
          <div
            className={`${
              textMessage.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-400"
            } h-10 w-10 -mt-[6px] ml-1 rounded-full grid place-content-center cursor-pointer`}
          >
            <AiOutlineLoading3Quarters className="fill-white text-xl ml-[3px] font-semibold animate-spin" />
          </div>
        ) : (
          <div
            onClick={handleSendMessage}
            className={`${
              textMessage.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-400"
            } h-10 w-10 -mt-[6px] ml-1 rounded-full grid place-content-center cursor-pointer`}
          >
            <IoMdSend className="fill-white text-xl ml-[3px]" />
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatGroup;
