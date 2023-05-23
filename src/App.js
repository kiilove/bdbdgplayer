import { useContext } from "react";
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

function App() {
  const { userInfo } = useContext(AuthContext);
  const RequireAuth = ({ children }) => {
    return userInfo ? children : <Navigate to="/login" />;
  };
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/loginerror" element={<LoginError />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registeremail" element={<RegisterWithEmail />} />
        <Route path="/regsuccess" element={<SuccessPage />} />
        <Route path="/successpage" element={<SuccessPage />} />
        <Route
          path="/career"
          element={
            <RequireAuth>
              <Career />
            </RequireAuth>
          }
        />
        <Route
          path="/cuplist"
          element={
            <RequireAuth>
              <CupList />
            </RequireAuth>
          }
        />
        <Route
          path="/careerview"
          element={
            <RequireAuth>
              <CareerView />
            </RequireAuth>
          }
        />
        <Route
          path="/analyzedetail"
          element={
            <RequireAuth>
              <AnalyzeDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/feed"
          element={
            <RequireAuth>
              <Feed />
            </RequireAuth>
          }
        />
        <Route
          path="/qrfull"
          element={
            <RequireAuth>
              <QrFull />
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
          path="/contestjoinedit/:invoiceId"
          element={
            <RequireAuth>
              <ContestJoinEdit />
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
        <Route
          path="/policy3"
          element={
            <RequireAuth>
              <Policy3 />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
