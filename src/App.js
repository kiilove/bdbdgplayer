import React, { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import "./App.css";
import RequireAuth from "./components/auth/RequireAuth";
import Home from "./pages/Home";

const CupList = lazy(() => import("./pages/CupList"));
const Gbbf = lazy(() => import("./pages/Gbbf"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Register = lazy(() => import("./pages/Register"));
const RegisterWithEmail = lazy(() => import("./pages/RegisterWithEmail"));
const RegisterSuccess = lazy(() => import("./pages/RegisterSuccess"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const EditSuccessPage = lazy(() => import("./pages/EditSuccessPage"));
const ContestJoin = lazy(() => import("./pages/ContestJoin"));
const ContestJoinEdit = lazy(() => import("./pages/ContestJoinEdit"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Policy3 = lazy(() => import("./components/Policy3"));

const PageFallback = () => (
  <div className="min-h-screen bg-[#F5F5F7] flex justify-center items-center">
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
