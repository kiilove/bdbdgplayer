import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import MessageBox from "./components/MessageBox";
import { AuthContext } from "./context/AuthContext";
import AnalyzeDetail from "./pages/AnalyzeDetail";
import Career from "./pages/Career";
import CareerView from "./pages/CareerView";
import CupJoin from "./pages/CupJoin";
import CupList from "./pages/CupList";
import EditProfile from "./pages/EditProfile";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginError from "./pages/LoginError";
import MyProfile from "./pages/MyProfile";
import QrFull from "./pages/QrFull";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import RegisterWithEmail from "./pages/RegisterWithEmail";
import SuccessPage from "./pages/SuccessPage";
import ContestJoin from "./pages/ContestJoin";
import Policy3 from "./components/Policy3";
import ContestJoinEdit from "./pages/ContestJoinEdit";
import EditSuccessPage from "./pages/EditSuccessPage";
import { UserContext } from "./context/UserContext";
import { RotatingLines } from "react-loader-spinner";
import JoinCupConfirm from "./modals/JoinCupConfirm";
import JoinCupEditConfirm from "./modals/JoinCupEditConfirm";
import ResetPassword from "./pages/ResetPassword";
import Gbbf from "./pages/Gbbf";

function App() {
  const { currentUserInfo } = useContext(UserContext);
  const { userState, setUserState } = useState("wait");
  const { isLoading, setIsLoading } = useState(true);

  const storedValue = localStorage.getItem("globalValue");

  const RequireAuth = ({ children }) => {
    if (!currentUserInfo) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const Loading = (
    <div className="w-full h-full min-h-screen bg-[#0B0B0B] flex items-center justify-center">
      <RotatingLines
        strokeColor="white"
        strokeWidth="4"
        animationDuration="0.75"
        width="64"
        visible={true}
      />
    </div>
  );

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/loginerror" element={<LoginError />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registeremail" element={<RegisterWithEmail />} />
        <Route path="/regsuccess" element={<RegisterSuccess />} />
        <Route path="/successpage" element={<SuccessPage />} />
        <Route path="/editsuccesspage" element={<EditSuccessPage />} />
        <Route path="/career" element={<Career />} />
        <Route path="/cuplist" element={<CupList />} />
        <Route path="/careerview" element={<CareerView />} />
        <Route path="/gbbf" element={<Gbbf />} />
        <Route path="/analyzedetail" element={<AnalyzeDetail />} />
        <Route path="/feed" element={<Feed />} />

        <Route
          path="/contestjoinedit/:invoiceId"
          element={<ContestJoinEdit />}
        />
        <Route path="/contestjoin/:contestId" element={<ContestJoin />} />

        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/policy3" element={<Policy3 />} />
        <Route path="/joincupconfirm" element={<JoinCupConfirm />} />
        <Route path="/joincupeditconfirm" element={<JoinCupEditConfirm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
