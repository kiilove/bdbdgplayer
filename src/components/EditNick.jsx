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

const EditNick = () => {
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const [pNick, setPNick] = useState("");
  const [nickValidate, setNickValidate] = useState(false);
  const pNickRef = useRef();

  const updatePlayer = async (data) => {
    setIsLoading(true);
    await setDoc(
      doc(db, "players_pool", pInfo.id),
      { ...data },
      { merge: true }
    )
      .then(() => {
        if (pNick !== ("" || undefined || null)) {
          setCurrentUserInfo({ ...data });
        }
      })
      .then(() => setIsLoading(false))
      .then(() => setNickValidate(false));
  };

  const pNickReg = () => {
    setNickValidate(true);
    const nick = pNickRef.current.value;
    const regNick = nick.replace(
      /[`~!@#$%^&*()_|+\-=?;:'"<>\{\}\[\]\\\/ ]/g,
      ""
    ); // 숫자를 제외한 모든 문자 제거

    setPNick((prev) => (prev = regNick));
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
              <input
                type="text"
                name="pNick"
                id="pNick"
                value={pNick}
                onChange={() => pNickReg()}
                onBlur={() => {
                  pNick === "" ? setNickValidate(false) : setNickValidate(true);
                }}
                maxLength="20"
                ref={pNickRef}
                placeholder={pInfo.pNick || "닉네임을 입력해주세요"}
                className="bg-transparent focus:outline-none w-full p-4 text-white text-sm placeholder-neutral-600"
              />
            </div>
            <div className="flex w-full py-1">
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• 특수문자는 사용하실 수 없습니다.</li>
                <li>• 20자까지 허용됩니다.</li>
                <li>• 중복 검사 후 변경됩니다.</li>
              </ul>
            </div>
            <div className="flex w-full mt-4">
              <button
                className={`w-full py-3.5 rounded-full font-black text-sm transition tracking-tight ${
                  nickValidate
                    ? "bg-white hover:bg-neutral-200 text-black cursor-pointer shadow-lg"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
                onClick={() => updatePlayer({ ...pInfo, pNick })}
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

export default EditNick;
