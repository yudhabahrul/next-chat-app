import Image from "next/image";
import { IoSearchOutline, IoVideocam } from "react-icons/io5";
import { BsChatFill } from "react-icons/bs";
import { GoPerson } from "react-icons/go";
import { AiOutlineHeart } from "react-icons/ai";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/type";

const GroupInfo = () => {
  const { currentUser } = useContext(AuthContext) as AuthContextType;

  return (
    <section className="h-screen bg-gray-100 flex-[1] px-4 sm:hidden">
      <div className="relative w-full h-8 my-8 overflow-hidden">
        <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 ml-[10px] stroke-gray-400" />
        <input
          type="text"
          placeholder="Search people"
          className="w-full h-full outline-none rounded-2xl p-[3px] pl-8 text-sm placeholder:text-gray-400 placeholder:text-[0.8rem]"
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Image
          className="rounded-full w-24 h-24 object-cover"
          src={currentUser?.photoURL as string}
          width={96}
          objectFit="cover"
          height={96}
          alt="Picture of the author"
        />
        <h2 className="text-xl text-slate-700 mt-3">
          {currentUser?.displayName}
        </h2>
        <p className="text-slate-600 -mt-1">Programmer</p>
        <ul className="flex mt-5">
          <li className="flex flex-col items-center p-3 pr-12 border-r-2 border-gray-200 cursor-pointer">
            <span className="w-14 h-14 bg-[rgba(130,176,219,0.2)] hover:bg-[rgba(130,176,219,0.35)] p-3 rounded-full grid place-content-center">
              <BsChatFill className="fill-blue-500 text-2xl" />
            </span>
            <p className="text-[0.8rem] mt-1 text-slate-500">Chat</p>
          </li>
          <li className="flex flex-col items-center p-3 pl-12 cursor-pointer">
            <span className="w-14 h-14 bg-[rgba(130,176,219,0.2)] hover:bg-[rgba(130,176,219,0.35)] p-3 rounded-full grid place-content-center">
              <IoVideocam className="fill-blue-500 text-2xl" />
            </span>
            <p className="text-[0.8rem] mt-1 text-slate-500">Video Call</p>
          </li>
        </ul>
      </div>
      <ul className="mt-4">
        <li className="flex items-center space-x-1 cursor-pointer">
          <GoPerson className="text-gray-500 text-lg" />
          <span className="text-[0.8rem] text-slate-500">View Friends</span>
        </li>
        <li className="flex items-center space-x-1 mt-3 cursor-pointer">
          <AiOutlineHeart className="text-gray-500 text-lg" />
          <span className="text-[0.8rem] text-slate-500">Add to Favorite</span>
        </li>
      </ul>
      <h2 className="text-[0.8rem] mt-4 ml-1 text-slate-600 font-bold">
        Attachments
      </h2>
      <ul className="flex items-center space-x-2 text-center *:py-4 *:text-[0.7rem] *:text-blue-500 *:rounded-md mx-1 *:cursor-pointer mt-4">
        <li className="flex-1 bg-[rgba(130,176,219,0.2)] hover:bg-[rgba(130,176,219,0.35)]">
          PDF
        </li>
        <li className="flex-1 bg-[rgba(130,176,219,0.2)] hover:bg-[rgba(130,176,219,0.35)]">
          Video
        </li>
        <li className="flex-1 bg-[rgba(130,176,219,0.2)] hover:bg-[rgba(130,176,219,0.35)]">
          MP3
        </li>
        <li className="flex-1 bg-[rgba(130,176,219,0.2)] hover:bg-[rgba(130,176,219,0.35)]">
          Image
        </li>
      </ul>
      <p className="py-[0.1rem] text-center w-14 mx-auto mt-5 border border-blue-500 text-[0.65rem] text-blue-500 rounded-2xl cursor-pointer">
        View All
      </p>
    </section>
  );
};

export default GroupInfo;
