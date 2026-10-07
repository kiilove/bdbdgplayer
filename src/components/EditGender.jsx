import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { RotatingLines } from "react-loader-spinner";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";
import { UserContext } from "../context/UserContext";

const EditGender = () => {
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const [pGender, setPGender] = useState(pInfo.pGender || "m");
  const [genderValidate, setGenderValidate] = useState(false);

  const updatePlayer = async (data) => {
    setIsLoading(true);
    await setDoc(
      doc(db, "players_pool", pInfo.id),
      { ...data },
      { merge: true }
    )
      .then(() => {
        if (pGender !== ("" || undefined || null)) {
          setCurrentUserInfo({ ...data });
        }
      })
      .then(() => setIsLoading(false));
  };

  const pGymReg = (e) => {
    e.preventDefault();
    setGenderValidate(true);

    setPGender((prev) => (prev = e.target.value));
  };

  return (
    <div
      className="flex w-full h-full justify-center items-start align-top bg-[#0B0B0B] text-white flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div
        className={`absolute top-0 left-1/2 w-full h-screen border-0 px-10 py-3 outline-none flex flex-col z-50 justify-center items-center ${
          !isLoading && "hidden"
        }`}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          maxWidth: "420px",
          transform: "translate(-50%, 0%)",
        }}
      >
        <RotatingLines
          strokeColor="white"
          strokeWidth="5"
          animationDuration="0.75"
          width="64"
          visible={true}
        />
      </div>
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-[#0B0B0B] px-4">
        <div className="flex flex-col w-full h-full mt-6 mb-5">
          <div className="flex w-full h-full flex-col bg-[#141414] border border-neutral-800 rounded-3xl p-6 gap-y-4 shadow-xl">
            <div className="flex w-full bg-[#1A1A1A] border border-neutral-800 rounded-2xl">
              <select
                className="w-full bg-transparent focus:outline-none p-4 text-white text-sm cursor-pointer"
                value={pGender}
                onChange={(e) => setPGender(e.target.value)}
              >
                <option value="m" className="bg-[#1A1A1A] text-white">
                  남자
                </option>
                <option value="f" className="bg-[#1A1A1A] text-white">
                  여자
                </option>
              </select>
            </div>

            <div className="flex w-full mt-4">
              <button
                className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-black text-sm rounded-full shadow-lg transition tracking-tight cursor-pointer"
                onClick={() => updatePlayer({ ...pInfo, pGender })}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGender;
