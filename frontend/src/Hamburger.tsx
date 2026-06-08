import clsx from "clsx";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const Hamburger = ({ isOpen, setIsOpen }: Props) => {
  return (
    <button
      className="group h-11 w-11 rounded-lg hover:cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="grid justify-items-center gap-1.5">
        <span
          className={clsx(
            "h-1 w-8 rounded-full bg-gray-100 transition duration-500 ",
            isOpen && "rotate-45 translate-y-2.5",
          )}
        ></span>
        <span
          className={clsx(
            "h-1 w-8 rounded-full bg-gray-100 transition duration-500",
            isOpen && "scale-x-0",
          )}
        ></span>
        <span
          className={clsx(
            "h-1 w-8 rounded-full bg-gray-100 transition duration-500 ",
            isOpen && "-rotate-45 -translate-y-2.5",
          )}
        ></span>
      </div>
    </button>
  );
};

export default Hamburger;
