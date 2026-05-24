// app.js

import { clsx } from "clsx";
import React, { useState } from "react";
import Hamburger from "./Hamburger";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}
const Header = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="">
      <div className="h-12 md:bg-[#eeeeee] rounded-b-md bg-p-300 text-white ">
        <div className="flex justify-between items-center pl-1 h-full max-w-2xl mx-auto md:px-2 md:shadow md:bg-p-300 md:rounded-b-lg">
          <div className="text-2xl md:text-3xl tracking-tight">
            Ordprov
            <span className="text-[12px]  tracking-wide">.com</span>
          </div>
          <Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
