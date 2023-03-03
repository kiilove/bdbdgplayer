import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";

const EditBirth = () => {
  const { userInfo } = useContext(AuthContext);
  const { pInfo, editDispatch } = useContext(PlayerEditContext);

  const [pBirth, setPBirth] = useState("");
  const [birthValidate, setBirthValidate] = useState(false);
  const pBirthRef = useRef();

  const updatePlayer = async (data) => {
    await setDoc(doc(db, "player", userInfo.id), { ...data }, { merge: true })
      .then(() => {
        if (pBirth !== ("" || undefined || null)) {
          editDispatch({ type: "EDIT", payload: data });
        }
      })
      .then(() => setBirthValidate(false))
      .then(() => {
        console.log("업데이트 완료");
      });
  };

  const pBirthReg = () => {
    setBirthValidate(true);
    const birth = pBirthRef.current.value;
    const regBirth = birth.replace(/[^0-9]/g, ""); // 숫자를 제외한 모든 문자 제거

    setPBirth((prev) => (prev = regBirth));
  };
  return (
    <div
      className="flex w-full h-full justify-center items-start align-top bg-white flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
        <div className="flex flex-col w-full h-full mt-5 mb-5">
          <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
            <div className="flex w-full h-10 bg-white border-b border-gray-500">
              <input
                type="text"
                name="pBirth"
                id="pBirth"
                value={pBirth}
                onChange={() => pBirthReg()}
                onBlur={() => {
                  pBirth === ""
                    ? setBirthValidate(false)
                    : setBirthValidate(true);
                }}
                maxLength="20"
                ref={pBirthRef}
                inputMode="numeric"
                placeholder={pInfo.pBirth || "생년월일(8자리)"}
                className=" bg-transparent focus:ring-0 outline-none w-full p-3"
              />
            </div>
            <div className="flex w-full py-2">
              <ui className="text-xs text-gray-500">
                <li className="h-6">
                  <span className="text-sm">
                    연도(4자리)월(2자리)일(2자리) 형식으로 입력해주세요
                  </span>
                </li>
                <li className="h-6">
                  <span className="text-sm">20자까지 허용됩니다.</span>
                </li>
                <li className="h-6">
                  <span className="text-sm">중복 검사후 변경됩니다.</span>
                </li>
              </ui>
            </div>
            <div className="flex w-full py-2 px-2 mt-5">
              <button
                className={`w-full h-9 text-white font-semibold ${
                  birthValidate ? "bg-orange-500" : "bg-gray-400"
                }`}
                onClick={() => updatePlayer({ ...pInfo, pBirth })}
              >
                저 장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBirth;
