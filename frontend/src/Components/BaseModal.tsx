import React, { useRef } from "react";
import Modal from "./Modal";
import useClickOutside from "../hooks/useClickOutside";
import clsx from "clsx";
import CloseIcon from "../assets/SVG/CloseIcon";
interface Props {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title?: string;
  smallPadding?: boolean;
  maxWidth?: number;
}
export default function BaseModal({
  children = null,
  isOpen,
  setIsOpen,
  title,
  smallPadding = false,
  maxWidth = 768,
}: Props) {
  const modalReference = useRef<HTMLDivElement>(null);
  useClickOutside(modalReference as React.RefObject<HTMLDivElement>, () => {
    setIsOpen(false);
  });
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        className={clsx(
          " bg-black/40  sm:p-6 p-2 py-16",
        )}
      >
        <div className="w-full">
          <div
            // style={{ maxWidth: `${maxWidth}px` }}
            className="max-w-2xl m-auto flex w-full flex-col overflow-hidden rounded-md bg-neutral-100 p-4 text-black shadow-lg"
            ref={modalReference}
          >
            <div className="flex items-center justify-between">
              <div className="text-xl">{title}</div>
              <button
                className="group hover:cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <CloseIcon className="h-10 w-10 fill-p-200 group-hover:fill-p-600" />
              </button>
            </div>
            <div className="my-4"></div>
            <div className="h-full overflow-auto">{children}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
