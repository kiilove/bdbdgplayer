import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AnalyzeDetail from "./pages/AnalyzeDetail";
import Career from "./pages/Career";
import CareerView from "./pages/CareerView";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import Login from "./pages/Login";
import QrFull from "./pages/QrFull";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import RegisterWithEmail from "./pages/RegisterWithEmail";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registeremail" element={<RegisterWithEmail />} />
        <Route path="/regsuccess" element={<RegisterSuccess />} />
        <Route path="/career" element={<Career />} />
        <Route path="/careerview" element={<CareerView />} />
        <Route path="/analyzedetail" element={<AnalyzeDetail />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/qrfull" element={<QrFull />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
