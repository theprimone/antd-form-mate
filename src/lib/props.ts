import { FormItemProps } from "antd/lib/form";
import { InputNumberProps } from "antd/lib/input-number";
import { PasswordProps, TextAreaProps, InputProps } from "antd/lib/input";
import { SliderProps } from "antd/lib/slider";
import {
  CustomDatePickerProps,
  CustomRangePickerProps,
} from "./item-components/CustomDatePicker/index";
import { CustomSwitchProps } from "./item-components/CustomSwitch/index";
import { CustomSelectProps } from "./item-components/CustomSelect/index";
import { LocationPickerProps } from "./item-components/LocationPicker/index";
import { PicturesWallProps } from "./item-components/PicturesWall/index";
import { CustomDraggerProps } from "./item-components/CustomDragger";
import { CustomCheckGroupProps } from "./item-components/CustomCheckGroup/index";
import { CustomRadioGroupProps } from "./item-components/CustomRadioGroup/index";
import { ColProps } from "antd/lib/col";

export type ComponentType =
  | "plain"
  | "custom"
  | "date"
  | "datetime"
  | "date-range"
  | "datetime-range"
  | "number"
  | "select"
  | "password"
  | "picture"
  | "switch"
  | "slider"
  | "file-dragger"
  | "location"
  | "check-group"
  | "radio-group"
  /** string input, no whitespace */
  | "textarea"
  | "email"
  | "string"

export type DefaultTypeHintOptions = {
  [key in ComponentType]?: any;
}

export type DefaultTypeRulesOptions = {
  [key in ComponentType]?: any;
}

export type ComponentProps =
  | CustomDatePickerProps
  | CustomRangePickerProps
  | InputNumberProps
  | CustomSelectProps
  | PasswordProps
  | PicturesWallProps
  | CustomSwitchProps
  | SliderProps
  | CustomDraggerProps
  | LocationPickerProps
  | CustomCheckGroupProps
  | CustomRadioGroupProps
  /** string input, no whitespace */
  | TextAreaProps
  | InputProps


export interface CustomFormItemProps extends Omit<FormItemProps, 'children'> {
  dense?: boolean;
}

export interface ItemConfig {
  type?: ComponentType;
  field: string;
  formItemProps?: CustomFormItemProps;
  componentProps?: ComponentProps;
  component?: JSX.Element;
}

export interface Layout {
  labelCol?: ColProps;
  wrapperCol?: ColProps;
}
