import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import "./App.css";
import RequireAuth from "./components/auth/RequireAuth";
import Home from "./pages/Home";

const importCupList = () => import("./pages/CupList");
const importGbbf = () => import("./pages/Gbbf");
const importLogin = () => import("./pages/Login");
const importResetPassword = () => import("./pages/ResetPassword");
const importRegister = () => import("./pages/Register");
const importRegisterWithEmail = () => import("./pages/RegisterWithEmail");
const importRegisterSuccess = () => import("./pages/RegisterSuccess");
const importSuccessPage = () => import("./pages/SuccessPage");
const importEditSuccessPage = () => import("./pages/EditSuccessPage");
const importContestJoin = () => import("./pages/ContestJoin");
const importContestJoinEdit = () => import("./pages/ContestJoinEdit");
const importMyProfile = () => import("./pages/MyProfile");
const importEditProfile = () => import("./pages/EditProfile");
const importPolicy3 = () => import("./components/Policy3");

const CupList = lazy(importCupList);
const Gbbf = lazy(importGbbf);
const Login = lazy(importLogin);
const ResetPassword = lazy(importResetPassword);
const Register = lazy(importRegister);
const RegisterWithEmail = lazy(importRegisterWithEmail);
const RegisterSuccess = lazy(importRegisterSuccess);
const SuccessPage = lazy(importSuccessPage);
const EditSuccessPage = lazy(importEditSuccessPage);
const ContestJoin = lazy(importContestJoin);
const ContestJoinEdit = lazy(importContestJoinEdit);
const MyProfile = lazy(importMyProfile);
const EditProfile = lazy(importEditProfile);
const Policy3 = lazy(importPolicy3);

const PageFallback = () => (
  <div className="min-h-screen bg-[#F6F7F9] flex justify-center items-center">
    <RotatingLines
      strokeColor="#111111"
      strokeWidth="4"
      animationDuration="0.75"
      width="48"
      visible={true}
    />
  </div>
);

function App() {
  // 초기 메인 화면 렌더링 완료 후 브라우저 유휴 시간에 주요 라우트 청크를 백그라운드 프리페치
  useEffect(() => {
    const prefetchCoreRoutes = () => {
      importCupList();
      importGbbf();
      importContestJoin();
      importMyProfile();
      importLogin();
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(prefetchCoreRoutes, {
        timeout: 2500,
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timerId = setTimeout(prefetchCoreRoutes, 1200);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={2400}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        closeButton={false}
        limit={2}
      />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/auth/action" element={<ResetPassword />} />
          <Route path="/__/auth/action" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registeremail" element={<RegisterWithEmail />} />
          <Route path="/regsuccess" element={<RegisterSuccess />} />
          <Route path="/successpage" element={<SuccessPage />} />
          <Route path="/editsuccesspage" element={<EditSuccessPage />} />
          <Route path="/cuplist" element={<CupList />} />
          <Route path="/gbbf" element={<Gbbf />} />

          <Route
            path="/contestjoinedit/:invoiceId"
            element={
              <RequireAuth>
                <ContestJoinEdit />
              </RequireAuth>
            }
          />
          <Route
            path="/contestjoin/:contestId"
            element={
              <RequireAuth>
                <ContestJoin />
              </RequireAuth>
            }
          />
          <Route
            path="/myprofile"
            element={
              <RequireAuth>
                <MyProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/editprofile"
            element={
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            }
          />

          <Route path="/policy3" element={<Policy3 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
