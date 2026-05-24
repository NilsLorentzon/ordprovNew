import { useState } from "react";
import type StartPage from "./StartPage";

function Test() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="h-12 bg-p-100 text-white ">
      <div className="flex justify-between">
        <div className="text-2xl">Ordprov</div>
        <div className="">menu</div>
      </div>
    </div>
  );
}

export default Test;
