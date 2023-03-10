import React from "react";
import BottomMenu from "../components/BottomMenu";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { BsPenFill, BsFillCameraFill } from "react-icons/bs";
import { DEFAULT_AVATAR } from "../consts";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useMemo } from "react";
import { doc, setDoc } from "firebase/firestore";
import { PlayerEditContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCallback } from "react";
import { ColorRing, RotatingLines } from "react-loader-spinner";

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};

const MyProfile = () => {
  const { userInfo } = useContext(AuthContext);
  const { pInfo, editDispatch } = useContext(PlayerEditContext);
  const [playerInfo, setPlayerInfo] = useState({ ...pInfo });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadURLs, setDownloadURLs] = useState([
    { link: "", filename: "" },
  ]);
  const navigate = useNavigate();

  const uploadFiles = async (files, path) => {
    let dummy = [];
    setIsLoading(true);

    const promises = await files.map((file) => {
      const filename = makeFileName(file.name, "P");
      const storageRef = ref(storage, `${path}/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              dummy.push({ link: downloadURL, filename });
              return dummy;
            })
            .then((dummy) => {
              setDownloadURLs(() => [...dummy]);
            });
        }
      );

      return uploadTask;
    });

    Promise.all(promises);
  };

  const handleFileSelect = async (e) => {
    e.preventDefault();
    const path = `images/player/${userInfo.pUid}`;
    setFiles((prev) => (prev = Array.prototype.slice.call(e.target.files)));

    await uploadFiles(Array.prototype.slice.call(e.target.files), path);
  };

  const updatePlayerPic = async (data) => {
    await setDoc(
      doc(db, "player", userInfo.id),
      { ...data },
      { merge: true }
    ).then(() => {
      console.log("???????????? ??????");
    });
  };

  const updatePlayer = useCallback(
    async (data) => {
      await setDoc(doc(db, "player", userInfo.id), { ...data }, { merge: true })
        .then(() => setIsLoading(false))
        .then(() => {
          console.log("???????????? ??????");
        });
    },
    [playerInfo.pPic]
  );

  useMemo(() => {
    if (downloadURLs[0].link !== (undefined || null || "")) {
      setPlayerInfo((prev) => ({ ...prev, pPic: downloadURLs[0].link }));
    }
  }, [downloadURLs]);
  useMemo(() => {
    console.log(playerInfo);
    if (playerInfo.pPic !== ("" || undefined || null)) {
      updatePlayer(playerInfo);
      editDispatch({ type: "EDIT", payload: playerInfo });
    }
  }, [playerInfo.pPic]);

  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col mb-32"
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
        <Header title="??? ?????????" />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
          <div className="flex flex-col w-full mt-5 mb-5">
            <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
              <label htmlFor="playerPic">
                <div className="flex h-full w-full justify-center items-center cursor-pointer">
                  <img
                    src={
                      (pInfo.pPic !== null || undefined || "") &&
                      (pInfo.pPic || DEFAULT_AVATAR)
                    }
                    className="rounded-3xl w-32 h-32"
                  />
                </div>
                <div className="flex w-7 h-7 rounded-xl relative -top-6 left-56 bg-white shadow-md border justify-center items-center">
                  <BsFillCameraFill className="text-gray-600" />
                </div>
                <input
                  name="playerPic"
                  id="playerPic"
                  type="file"
                  files={files}
                  className="hidden"
                  onChange={(e) => handleFileSelect(e)}
                />
              </label>
            </div>
            <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b">
              <span className="text-sm">??????(????????????)</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pName || "?????? ????????? ???????????????."}
              </span>
            </div>
            <button
              disabled
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              // onClick={() =>
              //   navigate("/editprofile", { state: { editType: "pEmail" } })
              // }
            >
              <span className="text-sm">?????????(????????????)</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pEmail || "????????? ????????? ???????????????."}
              </span>
            </button>
            <button
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pTel" } })
              }
            >
              <span className="text-sm">????????????</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pTel || "???????????? ????????? ???????????????."}
              </span>
            </button>

            <button
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pNick" } })
              }
            >
              <span className="text-sm">?????????</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pNick || "???????????? ????????? ??? ????????????."}
              </span>
            </button>
            <button
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pBirth" } })
              }
            >
              <span className="text-sm">????????????</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pBirth || "????????? ?????? ???????????? ????????? ?????????????????????."}
              </span>
            </button>
            <button
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pGender" } })
              }
            >
              <span className="text-sm">??????</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pGender
                  ? pInfo.pGender === "m"
                    ? "??????"
                    : "??????"
                  : "????????? ?????? ???????????? ????????? ?????????????????????."}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
