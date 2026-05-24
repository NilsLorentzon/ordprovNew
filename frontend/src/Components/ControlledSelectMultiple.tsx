import clsx from "clsx";
import Select from "react-select";
import type { ActionMeta, MultiValue, SingleValue } from "react-select";
import { SocInfoIcon } from "./ControlledSelect";
interface Option {
  label: string;
  value: any;
}
interface Props {
  label: string;
  options: readonly Option[];
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

export default function ControlledSelectMultiple({
  label,
  options,
  value,
  onChange,
  isDisabled = false,
  wrapperClassName,
  iconHandlers,
}: Props) {
  const customStyles = {
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "hsl(250, 45%, 10%)",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "white", // Set your desired text color here
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      color: "black",
      backgroundColor: state.isFocused ? "var(--color-p-700)" : null,
      // backgroundColor: "red",
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: "rgb(255 255 255)",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      color: "white",
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: "var(--color-p-700)",
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      // borderWidth: state.isDisabled ? "0px" : "1px",
      // borderColor: "gray",
      borderWidth: "0px",
      color: "white",
      backgroundColor: state.isDisabled ? "rgb(36 33 45)" : "var(--color-p-200)",
      borderRadius: "4px",
    }),
    menu: ({ ...css }) => ({
      ...css,
      width: "max-content",
      minWidth: "100%",
      // backgroundColor: "var(--p1)",
    }),
  };
  return (
    <div className={clsx("w-full", wrapperClassName || "")}>
      <label
        className={clsx("mb-1 inline-block px-1 first-letter:capitalize text-lg  ")}
      >
        {label}
        <span className="p-1 pb-1 inline-block -translate-y-0.5 relative ">
          <SocInfoIcon iconHandlers={iconHandlers} />
        </span>
      </label>
      <Select
        options={options}
        styles={customStyles}
        isMulti={true}
        onChange={(option: any, action: any) => {
          onChange(option, action);
        }}
        isDisabled={isDisabled}
        value={value}
      />
    </div>
  );
}
