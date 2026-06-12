import clsx from "clsx";
import Select from "react-select";
import type { ActionMeta } from "react-select";
interface Option {
  label: string;
  value: any;
}
interface Props {
  label: string | React.ReactNode;
  options: Option[];
  value: any;
  onChange: (option: Option, action: ActionMeta<Option>) => void;
  isDisabled?: boolean | undefined;
  wrapperClassName?: string;
  iconHandlers?: {
    iconClickHandler: () => void;
    isSelected: boolean;
    showInfo: boolean;
  };
}

export default function ControlledSelect({
  label,
  options,
  value,
  onChange,
  isDisabled = false,
  wrapperClassName,
  iconHandlers,
}: Props) {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: "black",
      backgroundColor: state.isFocused ? "#f2f7ff" : null,
      // backgroundColor: "red",
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: "black",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "black",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "black",
      // cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    control: (provided: any) => ({
      ...provided,
      // borderWidth: state.isDisabled ? "0px" : "1px",
      // borderColor: "gray",
      // borderWidth: "0px",
      border: "2px solid black",
      color: "black",
      backgroundColor: "#f2f7ff",

      // backgroundColor: state.isDisabled ? "var(--p3)" : "var(--p3)",
      // opacity: state.isDisabled ? "0.7" : "1",
      borderRadius: "4px",
    }),
    menu: ({ ...css }) => ({
      ...css,
      width: "max-content",
      minWidth: "100%",
      // backgroundColor: "var(--p1)",
    }),
  };
  const modifiedOnChange = (
    option: Option | null,
    action: ActionMeta<Option>,
  ) => {
    if (option !== null) {
      onChange(option, action);
    }
  };
  const currentOption = options.find((option: any) => option.value === value);
  if (!currentOption) {
    throw new Error(`error in react select value:${value} label:${label}`);
  }
  // const currentOptionIndex = options.indexOf(currentOption);
  // move current option to start of options
  // options.splice(currentOptionIndex, 1);
  // options.unshift(currentOption);

  return (
    <div className={clsx("w-full", wrapperClassName || "")}>
      {label !== "" && (
        <label
          className={clsx(
            "mb-1 flex  text-lg items-end gap-1 px-1 first-letter:capitalize ",
          )}
        >
          {label}
          <SocInfoIcon iconHandlers={iconHandlers} />
        </label>
      )}
      <Select
        options={options}
        styles={customStyles}
        isMulti={false}
        onChange={modifiedOnChange}
        isDisabled={isDisabled}
        value={{
          value,
          label: currentOption.label,
        }}
      />
      {/* {infoText && (
        <BaseModal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          {infoText}
        </BaseModal>
      )} */}
    </div>
  );
}

interface SocInfoProps {
  iconHandlers?: {
    iconClickHandler: () => void;
    isSelected: boolean;
    showInfo: boolean;
  };
}
export function SocInfoIcon({ iconHandlers }: SocInfoProps) {
  if (iconHandlers && iconHandlers.showInfo)
    return (
      <button className="" onClick={iconHandlers.iconClickHandler}>
        <InfoIcon
          className={clsx(
            "inline h-6 w-6 ",
            iconHandlers.isSelected ? "fill-a-100" : "fill-gray-300",
          )}
        />
      </button>
    );
  return null;
}

function InfoIcon({ ...args }) {
  return (
    <svg {...args} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
}
