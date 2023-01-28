import React from "react";

const Drawer = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={
        "fixed overflow-hidden z-40 bg-gray-900 bg-opacity-25 inset-0 transition-transform " +
        (isOpen
          ? "  opacity-100 translate-x-0"
          : "  opacity-0 translate-x-full ")
      }
    >
      <div
        className={
          "w-3/4 max-w-lg z-40 right-0 absolute bg-white h-full shadow-2xl transition-transform" +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        test
      </div>
      <div className="w-screen h-full" onClick={() => setIsOpen(false)}></div>
    </div>
  );
};

export default Drawer;
