import { ChevronDown } from "lucide-react";
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  ComboBoxValue,
  ListBox,
  type ListBoxItemProps,
  type ValidationResult,
} from "react-aria-components/ComboBox";
import { Description, FieldError, FieldGroup, Input, Label } from "./Field";
import {
  DropdownItem,
  DropdownSection,
  type DropdownSectionProps,
} from "./ListBox";
import { Popover } from "./Popover";
import { composeTailwindRenderProps } from "./utils";
import { FieldButton } from "./FieldButton";
import SearchIcon from "../../assets/SVG/SearchIcon";

export interface ComboBoxProps<
  T extends object,
  M extends "single" | "multiple",
> extends Omit<AriaComboBoxProps<T, M>, "children"> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function ComboBox<
  T extends object,
  M extends "single" | "multiple" = "single",
>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: ComboBoxProps<T, M>) {
  return (
    <AriaComboBox
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1 ",
      )}
    >
      {/* <Label>{label}</Label> */}
      <FieldGroup>
        <FieldButton className="w-7 ml-2 outline-offset-0">
          <SearchIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-300" />
        </FieldButton>
        <Input className="ps-2 pe-1 " />
        {/* <ChevronDown aria-hidden className="w-4 h-4" /> */}
      </FieldGroup>
      {/* {props.selectionMode === "multiple" && (
        <ComboBoxValue
          placeholder="No items selected"
          className="text-xs text-neutral-600 dark:text-neutral-300"
        />
      )} */}
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="w-(--trigger-width)" placement="bottom end">
        <ListBox
          items={items}
          className="outline-0 bg-white p-1  text-black max-h-[400px] overflow-auto "
        >
          {children}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
//  [clip-path:inset(0_0_0_0_round_.75rem)] box-border
export function ComboBoxItem(props: ListBoxItemProps) {
  return <DropdownItem {...props} />;
}

export function ComboBoxSection(props: DropdownSectionProps<object>) {
  return <DropdownSection {...props} />;
}
