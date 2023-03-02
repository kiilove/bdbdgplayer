import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { BsPenFill, BsFillCameraFill } from "react-icons/bs";
import { DEFAULT_AVATAR } from "../consts";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useMemo } from "react";

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};

const EditPic = ({}) => {
  const [files, setFiles] = useState([]);
  const [uploadProgresses, setUploadProgresses] = useState({});
  const [downloadURLs, setDownloadURLs] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const uploadFiles = (files, path) => {
    let dummy = [];
    let promises = [];
    files.map((file) => {
      const filename = makeFileName(file.name, "P");
      const storageRef = ref(storage, `${path}/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, files);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgresses(() => ({
            ...uploadProgresses,
            [filename]: progress,
          }));
        },
        (error) => {
          console.error(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            dummy.push({ link: downloadURL, filename });
          });
        }
      );
      console.log(dummy);
      setDownloadURLs(dummy);
      promises.push(uploadTask);
      //return { uploadTask, dummy };
    });

    console.log(promises);
    Promise.all(promises).then(() => {
      setFiles([]);
      //setUploadProgresses({});
      //setDownloadURLs({});
      alert("업로드가 완료되었습니다.");
    });
  };

  const handleFileSelect = (e) => {
    //const files = e.target.files;
    //const uploadFilename = makeFileName(files, "P");
    e.preventDefault();
    const path = `images/player/${currentUser.playerUid}`;
    setFiles((prev) => (prev = Array.from(e.target.files)));
    //console.log(e.target.files);

    files && uploadFiles(Array.from(e.target.files), path);
  };

  useMemo(() => console.log(downloadURLs), [downloadURLs]);
  return (
    <div
      className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
        <div className="flex flex-col w-full mt-5 mb-5">
          <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
            <label htmlFor="playerPic">
              <div>
                {downloadURLs.length > 0
                  ? downloadURLs[0].link
                  : DEFAULT_AVATAR}
              </div>
              <div className="flex h-full w-full justify-center items-center">
                <img
                  src={
                    downloadURLs.length > 0
                      ? downloadURLs[0].link
                      : DEFAULT_AVATAR
                  }
                  className="rounded-3xl w-24 h-24"
                />
              </div>
              <div className="flex w-7 h-7 rounded-xl relative -top-7 left-52 bg-white shadow justify-center items-center">
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
        </div>
      </div>
    </div>
  );
};

export default EditPic;
