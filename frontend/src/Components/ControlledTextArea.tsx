import { useEffect, useState } from "react";

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}
export default function ControlledTextArea({ label, onChange, value }: Props) {
  const [hasFocus, setHasFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div className="flex w-full flex-col">
      {label && (
        <label className={"mb-1 rounded-t-md text-lg font-medium  "}>
          {label}
        </label>
      )}
      <textarea
        className="block
         w-full
        rounded-md bg-[#e8f0fe] p-2.5 text-black border-black/30 border-1
         placeholder-gray-400
        focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-400"
        spellCheck={false}
        // onChange={(e) => onChange(e.target.value)}
        // value={value}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={() => {
          setHasFocus(false);
          onChange(currentValue);
          setCurrentValue(value);
        }}
        onFocus={() => setHasFocus(true)}
        value={hasFocus ? currentValue : value}
        rows={5}
        maxLength={1000}
      />
    </div>
  );
}
