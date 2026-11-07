import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import RequireAuth from "./components/auth/RequireAuth";
import CupList from "./pages/CupList";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import RegisterWithEmail from "./pages/RegisterWithEmail";
import SuccessPage from "./pages/SuccessPage";
import ContestJoin from "./pages/ContestJoin";
import Policy3 from "./components/Policy3";
import ContestJoinEdit from "./pages/ContestJoinEdit";
import EditSuccessPage from "./pages/EditSuccessPage";
import ResetPassword from "./pages/ResetPassword";
import Gbbf from "./pages/Gbbf";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
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
    </BrowserRouter>
  );
}

export default App;
