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

const EditTel = () => {
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const [pTel, setPTel] = useState("");
  const [telValidate, setTelValidate] = useState(false);
  const pTelRef = useRef();

  const updatePlayer = async (data) => {
    setIsLoading(true);
    await setDoc(
      doc(db, "players_pool", pInfo.id),
      { ...data },
      { merge: true }
    )
      .then(() => {
        if (pTel !== ("" || undefined || null)) {
          setCurrentUserInfo({ ...data });
        }
      })
      .then(() => setIsLoading(false))
      .then(() => setTelValidate(false));
  };

  const pTelReg = () => {
    setTelValidate(true);
    const number = pTelRef.current.value;
    const regTelNumber = number
      .replace(/[^0-9]/g, "") // 숫자를 제외한 모든 문자 제거
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);

    setPTel((prev) => (prev = regTelNumber));
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
                name="pTel"
                id="pTel"
                value={pTel}
                onChange={() => pTelReg()}
                ref={pTelRef}
                inputMode="numeric"
                placeholder={pInfo.pTel || "핸드폰 번호를 입력해주세요"}
                className="bg-transparent focus:outline-none w-full p-4 text-white text-sm placeholder-neutral-600"
              />
            </div>
            <div className="flex w-full py-1">
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• 대시(-)는 자동으로 추가됩니다.</li>
                <li>• 실제 사용하는 번호를 입력해주세요.</li>
                <li>• 숫자만 입력 가능합니다.</li>
              </ul>
            </div>
            <div className="flex w-full mt-4">
              <button
                className={`w-full py-3.5 rounded-full font-black text-sm transition tracking-tight ${
                  telValidate
                    ? "bg-white hover:bg-neutral-200 text-black cursor-pointer shadow-lg"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
                onClick={() => updatePlayer({ ...pInfo, pTel })}
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

export default EditTel;
