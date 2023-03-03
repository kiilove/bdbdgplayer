import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";

const EditNick = () => {
  const { userInfo } = useContext(AuthContext);
  const { pInfo, editDispatch } = useContext(PlayerEditContext);

  const [pNick, setPNick] = useState("");
  const [nickValidate, setNickValidate] = useState(false);
  const pNickRef = useRef();

  const updatePlayer = async (data) => {
    await setDoc(doc(db, "player", userInfo.id), { ...data }, { merge: true })
      .then(() => {
        if (pNick !== ("" || undefined || null)) {
          editDispatch({ type: "EDIT", payload: data });
        }
      })
      .then(() => setNickValidate(false))
      .then(() => {
        console.log("업데이트 완료");
      });
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
      className="flex w-full h-full justify-center items-start align-top bg-white flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
        <div className="flex flex-col w-full h-full mt-5 mb-5">
          <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
            <div className="flex w-full h-10 bg-white border-b border-gray-500">
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
                className=" bg-transparent focus:ring-0 outline-none w-full p-3"
              />
            </div>
            <div className="flex w-full py-2">
              <ui className="text-xs text-gray-500">
                <li className="h-6">
                  <span className="text-sm">
                    특수문자는 사용하실 수 없습니다.
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
                  nickValidate ? "bg-orange-500" : "bg-gray-400"
                }`}
                onClick={() => updatePlayer({ ...pInfo, pNick })}
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

export default EditNick;
