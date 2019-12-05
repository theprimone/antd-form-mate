import React, { useContext } from "react";
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import { Form, Input, InputNumber, Slider } from "antd";
import { WrappedFormUtils, ValidationRule } from "antd/lib/form/Form";
import CustomDatePicker, { CustomRangePicker } from "./components/CustomDatePicker/index";
import CustomSwitch from "./components/CustomSwitch/index";
import CustomSelect from "./components/CustomSelect/index";
import LocationPicker from "./components/LocationPicker/index";
import PicturesWall from "./components/PicturesWall/index";
import CustomDragger from "./components/CustomUpload/CustomDragger";
import CustomCheckGroup from "./components/CustomCheckGroup/index";
import CustomRadioGroup from "./components/CustomRadioGroup/index";
import {
  ComponentType,
  CustomFormItemProps,
  ItemConfig,
  Layout,
  DefaultTypeHintOptions,
  DefaultTypeRulesOptions,
} from "./props";
import {
  ConfigContext,
  processSetCommenProps,
  defaultExtra,
} from '../ConfigContext';

const { TextArea, Password } = Input;


let defaultTypeHint = {
  email: "请输入正确的邮箱格式",
};
export function setDefaultTypeHint(options: DefaultTypeHintOptions) {
  defaultTypeHint = {
    ...defaultTypeHint,
    ...options,
  }
}

let defaultTypeRules = {
  email: [
    {
      type: "email",
      message: defaultTypeHint.email
    },
  ],
};
export function setDefaultTypeRule(options: DefaultTypeRulesOptions) {
  defaultTypeRules = {
    ...defaultTypeRules,
    ...options,
  }
}

const setValuePropName = (type: ComponentType) => {
  if (type === "switch") {
    return "checked";
  }
  return "value";
};

const defaultLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 }
};

function setInputComponent(type: ComponentType) {
  switch (type) {
    case "date":
      return <CustomDatePicker />;
    case "datetime":
      return <CustomDatePicker style={{ minWidth: "unset" }} format="YYYY-MM-DD HH:mm:ss" showTime />;
    case "datetime-range":
      return <CustomRangePicker format="YYYY-MM-DD HH:mm:ss" showTime />;
    case "date-range":
      return <CustomRangePicker format="YYYY-MM-DD" />;
    case "number":
      return <InputNumber placeholder="请输入" />;
    case "select":
      return <CustomSelect />;
    case "textarea":
      return <TextArea placeholder="请输入" />;
    case "password":
      return <Password placeholder="请输入密码" />;
    case "picture":
      return <PicturesWall />;
    case "switch":
      return <CustomSwitch />;
    case "slider":
      return <Slider />;
    case "file-dragger":
      return <CustomDragger />;
    case "location":
      return <LocationPicker />;
    case "check-group":
      return <CustomCheckGroup />;
    case "radio-group":
      return <CustomRadioGroup />;
    default:
      return <Input placeholder="请输入" />;
  }
}

function setDefaultTypeRules(type: ComponentType, rules: ValidationRule[]) {
  let result = [...rules];
  if (defaultTypeRules[type]) {
    result = [
      ...defaultTypeRules[type],
      ...result,
    ]
  }
  return result;
}

interface RenderFormItemProps {
  form: WrappedFormUtils,
  config: ItemConfig,
  formLayout?: Layout,
}
function RenderFormItem({ form, config, formLayout }: RenderFormItemProps) {
  const { setCommenProps, commenExtra = {} } = useContext(ConfigContext)
  const { getFieldDecorator } = form;
  const {
    type = "string",
    field,
    formItemProps = {} as CustomFormItemProps,
    fieldProps = {},
    componentProps = {},
    component,
  } = config;
  const { rules = [], initialValue, ...restFieldProps } = fieldProps;

  const {
    style = {},
    dense,
    extra,
    wrapperCol,
    labelCol,
    ...restFormItemProps
  } = formItemProps;

  const setLayout = () => {
    const itemLayout = wrapperCol && labelCol ? { wrapperCol, labelCol } : null;
    const layout = itemLayout || formLayout || defaultLayout;
    const noLayoutAndLabel = !itemLayout && !formLayout && !restFormItemProps.label;
    return noLayoutAndLabel ? { wrapperCol: { span: 24 } } : layout;
  }

  const setComponent = () => {
    return type === 'custom' ? component : (
      React.cloneElement(
        setInputComponent(type),
        {
          ...processSetCommenProps(setCommenProps)(type, _get(setInputComponent(type), 'props.style')),
          ...componentProps as any,
        }
      )
    )
  }

  const setItemComponent = () => {
    return type === 'plain' ? <span className="ant-form-text">{initialValue}</span> : getFieldDecorator(field, {
      initialValue,
      valuePropName: setValuePropName(type),
      rules: setDefaultTypeRules(type, rules),
      ...restFieldProps,
    })(setComponent());
  }

  function setExtra() {
    if (extra === false || extra === null) {
      return undefined;
    }
    return extra || { ...defaultExtra, ...commenExtra }[type];
  }

  return (
    <Form.Item
      key={field}
      style={dense ? { marginBottom: 0, ...style } : style}
      extra={setExtra()}
      {...setLayout()}
      {...restFormItemProps}
    >
      {setItemComponent()}
    </Form.Item>
  );
}

export const createFormItems = (form: WrappedFormUtils) => (
  itemsConfig: ItemConfig[],
  formLayout?: Layout,
) => {
  const { getFieldDecorator } = form || {} as any;
  if (!_isFunction(getFieldDecorator)) {
    throw new Error('GetFieldDecorator is not function.');
  }

  return itemsConfig.map(config => {
    const {
      type = "string",
      field,
      fieldProps = {},
    } = config;
    const { initialValue } = fieldProps;

    if (type === 'hidden') {
      getFieldDecorator(field, { initialValue })
      return null;
    }

    return <RenderFormItem form={form} config={config} formLayout={formLayout} />
  }).filter(item => item) as JSX.Element[];
};
