import React, { useRef } from 'react';
import { Form } from 'antd';

import { INTERNAL_HOOK_MARK } from '../../constants/components';
import { useIntl } from '../../contexts/Intlcontext';
import setInitialValueByType from '../../utils/setValue';
import { ComponentType, FormMateItemProps, Filter, FormMateProps, FormMateInstance } from '../../interfaces';
import { NewFormMateItemProps } from './FormMateItem';

export interface InjectIntlProps {
  propName: string;
  // 之前该字段名为 `id` ，由于父级组件（未探明，可能是表单组件）也会注入 `id` 属性，遂使用 intl 前缀
  intlPath: string;
  intlDefaultMessage: string;
  children: JSX.Element;
}

export const InjectIntl: React.FC<InjectIntlProps> = ({
  propName,
  intlPath,
  intlDefaultMessage,
  children,
  ...rest
}) => {
  const intl = useIntl();
  return React.cloneElement(children, {
    [propName]: intl.getMessage(intlPath, intlDefaultMessage),
    ...rest,
  });
};

export function isJsxChild(child: React.ReactNode): child is JSX.Element {
  return React.isValidElement(child) && typeof child !== 'string';
}

export function getChildName(child: React.ReactNode): string | null {
  if (isJsxChild(child)) {
    if (typeof child.type === 'string') {
      return child.type;
    }

    return (child.type as any).displayName || child.type.name || 'Component';
  }
  return null;
}

export function getChildType(child: React.ReactNode): ComponentType | null {
  if (React.isValidElement(child) && typeof child !== 'string') {
    return child.props.type;
  }
  return null;
}

export function isFormItem(child: React.ReactNode): child is JSX.Element {
  return !!(React.isValidElement(child) && getChildName(child)?.startsWith('FM'));
}

export const isFormDynamic = (child: React.ReactNode) => {
  return React.isValidElement(child) && (child.props as NewFormMateItemProps).dynamicRender;
};

export function getFormItemName(child: React.ReactNode): FormMateItemProps['name'] {
  if (isFormItem(child)) {
    return child.props.name;
  }
  return undefined;
}

export type Store = Filter<FormMateProps['initialValues'], Object>;

export type PostProcess = (values: Store) => Store;

export const processInitialValues = (values: Store, fieldsType: any, postProcess?: PostProcess) => {
  const result = { ...values };

  Object.keys(fieldsType).forEach((item) => {
    result[item] = setInitialValueByType(fieldsType[item], values?.[item]);
  });

  return postProcess ? postProcess(result) : result;
};

export function useFormMate(formMate?: FormMateInstance): [FormMateInstance] {
  const [antdForm] = Form.useForm();
  const storeRef = useRef<FormMateProps['initialValues']>();
  const fieldsTypeRef = useRef<any>();
  const postProcessRef = useRef<PostProcess>();

  const wrapForm: FormMateInstance = React.useMemo(
    () =>
      formMate || {
        ...antdForm,
        getFormMateInternalHook: (key: string) => {
          if (key === INTERNAL_HOOK_MARK) {
            return {
              setFieldsType: (types: any) => {
                if (!fieldsTypeRef.current) {
                  fieldsTypeRef.current = types;
                }
              },
              setPostProcess: (postProcess: PostProcess) => {
                if (!postProcessRef.current) {
                  postProcessRef.current = postProcess;
                }
              },
            };
          }
          return null;
        },
        setInitialValues: (values: Store) => {
          /**
           * 使用 Popover 等组件时由于还未渲染 FormMate 组件， fieldsTypeRef.current 可能为 `undefined` ，
           * 故与此类组件结合使用时，应在 FormMate 组件上直接配置 `initialValues`
           */
          if (fieldsTypeRef.current) {
            storeRef.current = processInitialValues(values, fieldsTypeRef.current, postProcessRef.current);
            console.log('store', storeRef.current);
            antdForm.setFieldsValue(storeRef.current);
          }
        },
        resetFieldsValue: () => {
          antdForm.setFieldsValue(storeRef.current || {});
        },
      },
    [formMate, antdForm]
  );

  return [wrapForm];
}
