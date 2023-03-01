import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import AnalyzeDetail from "./pages/AnalyzeDetail";
import Career from "./pages/Career";
import CareerView from "./pages/CareerView";
import CupJoin from "./pages/CupJoin";
import CupList from "./pages/CupList";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginError from "./pages/LoginError";
import QrFull from "./pages/QrFull";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import RegisterWithEmail from "./pages/RegisterWithEmail";

function App() {
  const { currentUser } = useContext(AuthContext);
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
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
        <Route path="/regsuccess" element={<RegisterSuccess />} />
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
          path="/cupjoin/:cupId"
          element={
            <RequireAuth>
              <CupJoin />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
