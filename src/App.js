import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Career from "./pages/Career";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterWithEmail from "./pages/RegisterWithEmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registeremail" element={<RegisterWithEmail />} />
        <Route path="/career" element={<Career />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
