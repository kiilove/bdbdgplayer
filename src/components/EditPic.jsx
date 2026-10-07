import React, { useEffect } from "react";
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
import { UserContext } from "../context/UserContext";

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};

const EditPic = ({}) => {
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const [playerInfo, setPlayerInfo] = useState({ ...pInfo });
  const [files, setFiles] = useState([]);
  const [downloadURLs, setDownloadURLs] = useState([
    { link: "", filename: "" },
  ]);

  const uploadFiles = async (files, path) => {
    let dummy = [];

    const promises = await files.map((file) => {
      const filename = makeFileName(file.name, "P");
      const storageRef = ref(storage, `${path}/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // upload progress
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
    const path = `images/player/${pInfo.playerUid}`;
    setFiles((prev) => (prev = Array.prototype.slice.call(e.target.files)));

    await uploadFiles(Array.prototype.slice.call(e.target.files), path);
  };

  const updatePlayerPic = async (data) => {
    await setDoc(
      doc(db, "players_pool", pInfo.id),
      { ...data },
      { merge: true }
    );
  };

  useMemo(() => {
    if (downloadURLs[0].link !== (undefined || null || "")) {
      setPlayerInfo((prev) => ({ ...prev, pPic: downloadURLs[0].link }));
    }
  }, [downloadURLs]);
  useMemo(() => {
    if (playerInfo.pPic !== ("" || undefined || null)) {
      updatePlayerPic(playerInfo);
      setCurrentUserInfo({ ...playerInfo });
    }
  }, [playerInfo.pPic]);

  return (
    <div
      className="flex w-full h-full justify-center items-start align-top bg-[#0B0B0B] text-white flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-[#0B0B0B] px-4">
        <div className="flex flex-col w-full mt-6 mb-5">
          <div className="flex w-full h-full flex-col bg-[#141414] border border-neutral-800 rounded-3xl p-8 gap-y-4 shadow-xl items-center justify-center text-center">
            <label htmlFor="playerPic" className="cursor-pointer flex flex-col items-center">
              <div className="relative">
                <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-neutral-700 shadow-2xl">
                  <img
                    src={
                      (pInfo.pPic !== null || undefined || "") &&
                      (pInfo.pPic || DEFAULT_AVATAR)
                    }
                    className="w-full h-full object-cover"
                    alt="Player Profile"
                  />
                </div>
                <div className="w-10 h-10 rounded-full absolute bottom-1 right-1 bg-white text-black shadow-xl flex justify-center items-center hover:scale-105 transition">
                  <BsFillCameraFill className="text-base text-black" />
                </div>
              </div>

              <input
                name="playerPic"
                id="playerPic"
                type="file"
                files={files}
                className="hidden"
                onChange={(e) => handleFileSelect(e)}
              />

              <div className="mt-5">
                <span className="text-xs font-black px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 transition shadow-lg inline-block">
                  사진 변경하기
                </span>
                <p className="text-[11px] text-neutral-500 mt-2 font-medium">
                  JPG, PNG 이미지를 업로드할 수 있습니다.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPic;
