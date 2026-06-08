import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";

// export function trim(value: any) {
//   if (typeof value === "string") {
//     return value.trim();
//   }
//   return value;
// }
interface Props {
  label?: string;
  value: string | number;
  setter: (e: any) => void;
  name?: any;
  extraClasses?: string;
  textPosition?: "left" | "center" | "right";
  size?: "small" | "medium" | "large";
  disableNumericReadable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  iconHandlers?: {
    iconClickHandler: () => void;
    isSelected: boolean;
    showInfo: boolean;
  };
  labelClassnames?: string;
  inputType?: string;
}
export default function ControlledInput({
  label = "",
  value,
  setter,
  name = uuidv4(),
  extraClasses = "",
  textPosition = "left",
  size = "medium",
  // disableNumericReadable = false,
  placeholder = "",
  disabled = false,
  // iconHandlers,
  labelClassnames = "",
  inputType = "text",
}: Props) {
  const textPositionClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  const sizeClasses = {
    small: "h-8 text-sm",
    medium: "h-10 text-base",
    large: "h-12 text-lg",
  };

  return (
    <div className="w-full">
      {label === "" ? null : (
        <label
          className={clsx("mb-1 inline-block pl-1 text-black", labelClassnames)}
        >
          {label}
          {/* <div className="ml-1 inline-block">
            <SocInfoIcon iconHandlers={iconHandlers}/>
          </div> */}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          spellCheck="false"
          maxLength={150}
          disabled={disabled}
          className={clsx(
            extraClasses,
            "relative disabled:bg-p-300/20 disabled:hover:cursor-not-allowed",
            "block border-1 border-black/30 w-full bg-[#e8f0fe] p-2 selected:bg-red-400",
            "rounded-md placeholder-gray-700/40",
            "text-black focus:ring-blue-500",
            // "placeholder:text-gray-100/70",
            sizeClasses[size],
            textPositionClasses[textPosition],
          )}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          onChange={(e) => setter(e.target.value)}
          // onBlur={() => {
          //   setHasFocus(false);
          //   if (currentValue === value) return;
          //   setter(trim(currentValue));
          //   setCurrentValue(trim(value));
          // }}
          // onFocus={() => setHasFocus(true)}
          // value={
          //   hasFocus
          //     ? currentValue
          //     : disableNumericReadable
          //       ? value
          //       : getNumericReadable(value)
          // }
          value={value}
          name={name}
        />
      </div>
    </div>
  );
}
