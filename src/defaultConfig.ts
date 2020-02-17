import _isFunction from 'lodash/isFunction';
import ViewerProps from 'react-viewer/lib/ViewerProps';
import { ComponentType } from './lib/props';
import { getBase64 } from './utils';

export const defaultLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
};

const commenStyle = { width: "100%" };
const setDefaultCommenStyle = (type: ComponentType) => {
  return type !== 'switch' ? commenStyle : {};
};

export function processSetCommenProps(setCommenProps: (type: ComponentType, defaultStyle: any) => any = () => ({})) {
  if (!_isFunction(setCommenProps)) {
    throw new Error('setCommenProps is not a function.');
  }

  return (type: ComponentType, defaultStyle: any) => {
    const { style = {}, ...rest } = setCommenProps(type) || {};
    // console.log(type, rest);
    return {
      ...rest,
      style: {
        ...defaultStyle,
        ...setDefaultCommenStyle(type),
        ...style,
      },
    };
  }
}

export const defaultExtra = {
  picture: "请上传图片",
};

export const defaultRules = {
  email: [
    {
      type: "email",
      message: "请输入正确的邮箱格式",
    },
  ],
};

export async function uploadByBase64(file: File) {
  const dataUrl = await getBase64(file);
  return {
    data: {
      url: dataUrl,
      thumbUrl: dataUrl,
    }
  };
}

export function getUrl(response: any = {}) {
  const { data } = response;
  return data;
}

export function isUploadOk(response: any = {}) {
  const { data } = response;
  return !!data;
}

export const pictureAccept = 'image/*';

export const amapKey = '1460ee2529622747f8faacac3e860bd6';

export const defaultViewerProps: ViewerProps = {
  rotatable: false,
  noImgDetails: true,
  scalable: false,
  zoomable: false,
};
