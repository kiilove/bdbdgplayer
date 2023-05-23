import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { RotatingLines } from "react-loader-spinner";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";

const EditTel = () => {
  const { userInfo } = useContext(AuthContext);
  const { pInfo, editDispatch } = useContext(PlayerEditContext);
  const [isLoading, setIsLoading] = useState(false);

  const [pTel, setPTel] = useState("");
  const [telValidate, setTelValidate] = useState(false);
  const pTelRef = useRef();

  const updatePlayer = async (data) => {
    setIsLoading(true);
    await setDoc(
      doc(db, "players_pool", userInfo.id),
      { ...data },
      { merge: true }
    )
      .then(() => {
        if (pTel !== ("" || undefined || null)) {
          editDispatch({ type: "EDIT", payload: data });
        }
      })
      .then(() => setIsLoading(false))
      .then(() => setTelValidate(false))
      .then(() => {
        console.log("업데이트 완료");
      });
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
      className="flex w-full h-full justify-center items-start align-top bg-white flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div
        className={`absolute top-0 left-1/2 w-full h-screen border-0 px-10 py-3 outline-none flex flex-col z-50 justify-center items-center ${
          !isLoading && "hidden"
        }`}
        style={{
          backgroundColor: "rgba(123, 124, 129, 0.4)",
          maxWidth: "420px",
          transform: "translate(-50%, 0%)",
        }}
      >
        <RotatingLines
          strokeColor="white"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
        <div className="flex flex-col w-full h-full mt-5 mb-5">
          <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
            <div className="flex w-full h-10 bg-white border-b border-gray-500">
              <input
                type="text"
                name="pTel"
                id="pTel"
                value={pTel}
                onChange={() => pTelReg()}
                ref={pTelRef}
                inputMode="numeric"
                placeholder={pInfo.pTel || "핸드폰 번호를 입력해주세요"}
                className=" bg-transparent focus:ring-0 outline-none w-full p-3"
              />
            </div>
            <div className="flex w-full py-2">
              <ui className="text-xs text-gray-500">
                <li className="h-6">
                  <span className="text-sm">
                    대시(-)는 자동으로 추가됩니다.
                  </span>
                </li>
                <li className="h-6">
                  <span className="text-sm">
                    실제 사용하는 번호를 입력해주세요.
                  </span>
                </li>
                <li className="h-6">
                  <span className="text-sm">숫자만 입력가능합니다.</span>
                </li>
              </ui>
            </div>
            <div className="flex w-full py-2 px-2 mt-5">
              <button
                className={`w-full h-9 text-white font-semibold ${
                  telValidate ? "bg-orange-500" : "bg-gray-400"
                }`}
                onClick={() => updatePlayer({ ...pInfo, pTel })}
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

export default EditTel;
