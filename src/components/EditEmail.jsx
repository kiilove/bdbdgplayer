import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { RotatingLines } from "react-loader-spinner";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";

const EditEmail = () => {
  const { userInfo } = useContext(AuthContext);
  const { pInfo, editDispatch } = useContext(PlayerEditContext);
  const [isLoading, setIsLoading] = useState(false);

  const [pEmail, setPEmail] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);
  const pEmailRef = useRef();

  const updatePlayer = async (data) => {
    setIsLoading(true);
    await setDoc(
      doc(db, "players_pool", userInfo.id),
      { ...data },
      { merge: true }
    )
      .then(() => {
        if (pEmail !== ("" || undefined || null)) {
          editDispatch({ type: "EDIT", payload: data });
        }
      })
      .then(() => setIsLoading(false))
      .then(() => setEmailValidate(false));
  };

  const pEmailValidation = () => {
    const email = pEmailRef.current.value;
    const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    const regexResult = regex.test(email);

    if (regexResult) {
      setPEmail((prev) => (prev = email));
      setEmailValidate(true);
    }

    // setPEmail((prev) => (prev = email));
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
                name="pEmail"
                id="pEmail"
                onBlur={() => pEmailValidation()}
                ref={pEmailRef}
                placeholder={pInfo.pEmail || "이메일 주소를 입력해주세요"}
                className="bg-transparent focus:outline-none w-full p-4 text-white text-sm placeholder-neutral-600"
              />
            </div>
            <div className="flex w-full py-1">
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• 이메일 주소 변경 시 다시 로그인해야 합니다.</li>
                <li>• 변경 도중 창을 닫으면 로그인이 제한될 수 있습니다.</li>
                <li>• 문제 발생 시 sos@bdbdg.kr로 연락 바랍니다.</li>
              </ul>
            </div>
            <div className="flex w-full mt-4">
              <button
                className={`w-full py-3.5 rounded-full font-black text-sm transition tracking-tight ${
                  emailValidate
                    ? "bg-white hover:bg-neutral-200 text-black cursor-pointer shadow-lg"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
                onClick={() => updatePlayer({ ...pInfo, pEmail })}
                disabled={!emailValidate}
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

export default EditEmail;
