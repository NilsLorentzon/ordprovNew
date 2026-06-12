import type { ReactNode } from "react";
import ReactModal from "react-modal";
import useGlobalEvents from "../hooks/useGlobalEvents";

ReactModal.defaultStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    filter: "blur(0px)",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    outline: "none",
  },
};
interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: ReactNode;
}
export default function Modal({ isOpen, setIsOpen, children }: Props) {
  return (
    <ReactModal
      isOpen={isOpen}
      shouldCloseOnEsc={true}
      onRequestClose={() => {
        setIsOpen(false);
      }}
      appElement={document.getElementById("root") || undefined}
    >
      {children}
    </ReactModal>
  );
}
