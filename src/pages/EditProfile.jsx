import React, { useContext } from "react";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { DEFAULT_AVATAR } from "../consts";
import { AuthContext } from "../context/AuthContext";
import { RxPencil1 } from "react-icons/rx";
import { BsPenFill, BsFillCameraFill } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import EditPic from "../components/EditPic";
import { PlayerEditContext } from "../context/PlayerContext";
import EditTel from "../components/EditTel";
import EditEmail from "../components/EditEmail";
import EditNick from "../components/EditNick";
import EditBirth from "../components/EditBirth";
import EditGym from "../components/EditGym";
import EditGender from "../components/EditGender";
import { UserContext } from "../context/UserContext";

const EditProfile = () => {
  const location = useLocation();
  let initInfo = { headerTitle: "" };
  switch (location.state.editType) {
    case "pPic":
      initInfo = {
        ...initInfo,
        headerTitle: "대표사진",
        component: <EditPic />,
      };
      break;
    case "pTel":
      initInfo = {
        ...initInfo,
        headerTitle: "전화번호 변경",
        component: <EditTel />,
      };
      break;
    case "pEmail":
      initInfo = {
        ...initInfo,
        headerTitle: "이메일 변경",
        component: <EditEmail />,
      };
      break;
    case "pNick":
      initInfo = {
        ...initInfo,
        headerTitle: "닉네임",
        component: <EditNick />,
      };
      break;
    case "pBirth":
      initInfo = {
        ...initInfo,
        headerTitle: "생년월일",
        component: <EditBirth />,
      };
      break;
    case "pGender":
      initInfo = {
        ...initInfo,
        headerTitle: "성별",
        component: <EditGender />,
      };
      break;
    case "pGym":
      initInfo = {
        ...initInfo,
        headerTitle: "소속클럽",
        component: <EditGym />,
      };
      break;
    default:
  }
  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-white flex-col mb-32"
        style={{ maxWidth: "420px" }}
      >
        <Header title={initInfo.headerTitle} />
        {initInfo.component}
      </div>
    </div>
  );
};

export default EditProfile;
