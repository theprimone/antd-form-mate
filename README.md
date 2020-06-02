<h1 align="center">antd-form-mate</h1>

<div align="center">

基于 ant design 的表单组件，配置化实现表单功能。

[![GitHub license](https://img.shields.io/github/license/zpr1g/antd-form-mate.svg)](https://github.com/zpr1g/antd-form-mate/blob/master/LICENSE)
[![npm Version](https://img.shields.io/npm/v/antd-form-mate.svg)](https://www.npmjs.com/package/antd-form-mate)
[![GitHub stars](https://img.shields.io/github/stars/zpr1g/antd-form-mate.svg)](https://github.com/zpr1g/antd-form-mate/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/zpr1g/antd-form-mate.svg)](https://github.com/zpr1g/antd-form-mate/issues)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/zpr1g/antd-form-mate.svg)](https://github.com/zpr1g/antd-form-mate/commits/master)

</div>

![antd-form-mate.png](https://i.loli.net/2020/04/26/gLTEx6RzYisNwGW.png)

**[在线预览 ->](http://zpr1g.github.io/antd-form-mate)**

## 安装

```shell
npm i -S antd-form-mate
```

## 开发

基于 [Storybook](https://storybook.js.org/docs/guides/guide-react/) 开发调试。

```shell
$ git clone https://github.com/zpr1g/antd-form-mate.git
$ cd antd-form-mate
$ npm install
$ npm start
```

## 使用

### 内建类型

|     | 类型             | 备注                                          |
| --- | ---------------- | --------------------------------------------- |
| 1   | `custom`         | 自定义组件类型，通过 `component` 属性传入组件 |
| 2   | `date`           |                                               |
| 3   | `time`           |                                               |
| 4   | `datetime`       |                                               |
| 5   | `date-range`     | 日期范围                                      |
| 6   | `time-range`     | 时间范围                                      |
| 7   | `datetime-range` | 日期时间范围                                  |
| 8   | `number`         |                                               |
| 9   | `select`         |                                               |
| 10  | `textarea`       |                                               |
| 11  | `password`       |                                               |
| 12  | `picture`        | 内置预览组件                                  |
| 13  | `switch`         |                                               |
| 14  | `slider`         | 滑动输入                                      |
| 15  | `file-dragger`   | 可拖拽文件上传                                |
| 16  | `string`         | **默认类型**                                  |
| 17  | `check-group`    | 多选框                                        |
| 18  | `radio-group`    | 单选框                                        |
| 19  | `number-range`   | 数字区间, `{ min?: number, max?: number }`    |
| 20  | `cascader`       | 级联选择                                      |

除此之外，可通过 [`registerComponent`](/src/index.ts#L11) 方法注册组件实现类型扩展或重写除 `custom` 类型外的组件。

内部组件除了 `switch` 和 `custom` 外，默认宽度均为 `100%` 。

### 新增功能

- 日期相关
  - `disabledPastDays` - 禁用过去的日期，包含今天
  - `disabledFutureDays` - 禁用未来的日期
- `select`
  - `onReload` - 配置后可渲染一个后置的刷新按钮
  - `addonAfter` - 自定义后置标签
- 文件相关
  - `filesCountLimit` - 上传文件个数限制
  - `fileSizeLimit` - 上传文件大小限制
  - `dimensionLimit` - 上传图片时，分辨率限制
  - `checkImage` - 额外判断图片上传的限制，返回错误提示
- `check-group` 、`radio-group`
  - `cols` 可配置分为几列渲染

关于文件上传的函数 `uploadFn` ，可统一配置，也可对 `file-dragger` 和 `picture` 单独配置。内部默认转换成 base64 字符串。配置后则通过接口上传，成功直接返回图片链接即可，否者返回 falsy 值即可。

### API

#### `FormMate` 表单容器

| 参数                | 说明                                                 | 类型                                                                               | 默认值 |
| ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- | ------ |
| `renderChildren`    | 自定义 `children` 渲染                               | `(children: React.ReactNode) => React.ReactNode`                                   | -      |
| `renderItem`        | 自定义每个子项的渲染                                 | `(item: React.ReactNode, name: string \| null, index?: number) => React.ReactNode` | -      |
| `postInitialValues` | 对于内部已经处理过的初始值再次处理                   | `Function`                                                                         | -      |
| `grid`              | 由于通过 `flex` 布局输入项较为常见，故集成了该配置   | [`Grid`](/src/interfaces.ts#L86)                                                   | -      |
| `formMate`          | 继承自 `Form` 组件的 `form` 属性，用于管理表单初始值 | [`FormMateInstance`](/src/interfaces.ts#L104)                                      | -      |
| `type`              | 统一设置表单中的所有类型                             | [`ComponentType`](/src/interfaces.ts#L23)                                          | -      |
| `plainRender`       | 自定义 `plain` 类型的渲染函数                        | [`Function`](/src/interfaces.ts#121)                                               | -      |

##### 关于 `initialValues`

为了简化使用，`FormMate` 组件会在内部统一转换 `initialValues` 且可**初始值可重写**，方便在实际业务场景中的使用和处理，故输入项（ `FormMate.Item` 和 `FormMate.Dynamic` ）必须作为 `FormMate` 组件的直接子组件，不能被其他组件包裹，这样才能让 `FormMate` 组件内部正确转换相关初始值。

1. 直接在 `FormMate` 配置 `initialValues` ，此法需自己转换相应的值类型。由于如果要实现法二的效果，还需要保存初始值的前一个状态并做深比较，私以为过于冗余了，故保留为 `Form` 组件原始的 API 。
2. [推荐]通过 `formMate` 配置 `initialValues` 。可参考[示例用法](/stories/MultiForm/index.tsx#L29)。这样就可以异步设置初始值了，如果需要重置表单，通过 `formMate` 调用 `resetFieldsValue()` 即可。此外，该方案还可以反复擦写初始值。

##### `type` 与 `plainRender`

配置 `type` 为 `'plain'` ，即可实现**详情展示**的功能，内部已初始化一个默认的对于不同类型渲染函数 [`defaultPlainRender`](/src/utils/plainRender.tsx#29) ，当然也可以通过 `plainRender` 属性重写默认的渲染函数。

#### `FormMate.Item` 表单项

| 参数             | 说明                                  | 类型                                                               | 默认值   |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------ | -------- |
| `type`           | 上述类型                              | [`ComponentType`](/src/interfaces.ts#L23)                          | `string` |
| `name`           | 字段名                                | [`NamePath`](https://next.ant.design/components/form-cn/#NamePath) | -        |
| `dense`          | 使得 Form.Item 的 `marginBottom` 为 0 | `boolean`                                                          | `false`  |
| `componentProps` | 额外的输入组件属性                    | [`ComponentProps`](/src/interfaces.ts#L47)                         | -        |

其他属性可参考 [`Form.Item`](https://ant.design/components/form-cn/#Form.Item) 组件属性，特别的 `children` 属性仅当类型为 `custom` 时可用。

#### `FormMate.Dynamic` 动态表单项

| 参数     | 说明         | 类型                                                   | 默认值 |
| -------- | ------------ | ------------------------------------------------------ | ------ |
| `render` | 判断是否渲染 | `(form: FormInstance) => boolean \| null \| undefined` | -      |

其他属性可参考 [`FormMate.Item`](#FormMate.Item-表单项) 组件属性，可配置 `children` 。

#### `ConfigProvider` 全局默认配置

参考[类型定义](/src/contexts/ConfigContext/index.tsx#L15)即可

#### 其他

内部使用的[部分组件和函数](/src/index.ts)已导出。

未尽事宜，可参考 [index.stories.tsx](/stories/index.stories.tsx) 。

### 基础用法

```tsx
import * as React from 'react';
import { Button } from 'antd';
import FormMate from 'antd-form-mate';

const BasicForm: React.FC = (props) => {
  const handleFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const handleFinishFailed = (errors) => {
    console.log('Errors:', errors);
  };

  return (
    <FormMate
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        paddingTop: 20,
      }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 12 }}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
    >
      <FormMate.Item
        type='string'
        name='name'
        label='姓名'
        rules={[{ required: true, message: '请输入姓名！' }]}
      />
      <FormMate.Dynamic
        type='string'
        name='dynamic'
        label='动态字段'
        render={({ getFieldValue }) => {
          return getFieldValue('name') === 'form';
        }}
      />
      <FormMate.Item wrapperCol={{ span: 12, offset: 8 }}>
        <Button type='primary' htmlType='submit'>
          提交
        </Button>
      </FormMate.Item>
    </FormMate>
  );
};

export default BasicForm;
```

## 模块化

### 注册新组件

可参考 [antd-form-mate-location](https://github.com/zpr1g/antd-form-mate-location/blob/master/stories/components/FormMateItem/index.tsx#L8) - 高德地图地理位置录入组件的注册使用。

### 扩展

将基于本组件实现新功能的模块称为扩展。

|     | 仓库                                                                        | 说明       |
| --- | --------------------------------------------------------------------------- | ---------- |
| 1   | [antd-form-mate-editable](https://github.com/zpr1g/antd-form-mate-editable) | 可编辑表格 |

## To Do

- [x] [antd-form-mate-v4](https://github.com/zpr1g/antd-form-mate/projects/1)
- [x] [antd-form-mate-v5](https://github.com/zpr1g/antd-form-mate/projects/2)

## 升级

### 从 v4 到 v5

表单组件升级到 antd 4.0 后，由于 `initialValues` 提升到 `Form` 组件中统一配置，且由于之前组件并没有对 `Form` 组件进行封装，导致了一些使用上的不便，故再次重构，旨在让整个组件的结构和使用更优雅。下面总结 v4 到 v5 的变更：

1. 文件结构调整，使其更清晰合理
2. 基于 `Form` 封装 `FormMate` 组件
3. 在 `FormMate` 中处理表单初始值，[统一字段值类型](./src/utils/setValue.ts#L8)

   - `switch` -> `boolean`
   - `date` 相关 -> `Moment`
   - 文件相关 -> `UploadFile[]` ，内部默认使用以 `/` 分割后的 url 数组的最后一个字符串作为文件名称
   - 特别的，如果像文件相关的内部字段转换不满足实际需求，可通过 `postInitialValues()` 属性对内部转换的结果再次进行处理

4. 重构表单项创建方式，使用 `FormMate.Item` 和 `FormMate.Dynamic` 组件创建
5. 移除不必要的默认配置，如 `defaultItemLayout` 等，完全可以在实际场景中二次封装即可

### 从 v3 到 v4

根据官方的表单升级说明——[从 v3 到 v4](https://next.ant.design/components/form/v3-cn)，也对本组件进行了相应的重构，v3 版本时，可不使用 `Form` 组件包裹生成的表单项，新版本充分利用了 `Form` 组件管理数据。下面总结几点本组件从 v3 到 v4 的注意事项：

1. 移除 `hidden` 类型，新版表单组件通过 `initialValues` 统一配置初始值，当需要隐藏类型的字段时，直接添加到 `initialValues` 即可。
2. 新增 `dynamic` 类型，可根据条件动态渲染某个字段。结合 `generateFn` 属性，可以快速实现本组件支持的其他类型组件的动态渲染。具体可参考 [`stories/BasicForm/index.tsx`](/stories/BasicForm/index.tsx#L253) 。
3. 移除 `afmLocale` 属性，通过 `IntlProvider` 配置国际化。
4. 移除扩展 `DatePicker` 中的 `onlyAfterToday` 和 `todayAndBefore` 属性，使用 `disabledPastDays` 和 `disabledFutureDays` 代替。
5. 重命名 `pictureFormateLimit` 属性为 `pictureAccept` ，并将默认值设为 `'image/*'` 。
6. 移除默认文件大小为 500M 的限制。
7. 修正笔误，配置全局属性中的 `commen` 改为 `common`
8. 移除默认的 `extra` 属性：

```js
export const defaultExtra = {
  picture: '请上传图片',
};
```

9. 新增 `registerComponent` 功能，可通过注册组件实现类型扩展或重写已有类型的组件。此外通过这种方式将 `location` 类型组件剥离到 [antd-form-mate-location](https://github.com/zpr1g/antd-form-mate-location) ，可单独安装使用。
10. 新增 `withCol` 属性，可直接让每个组件被 `Col` 组件包裹。特别的，当同时使用了 `withCol` 功能 、 `dynamic` 类型和 `component` 字段时，切记返回组件时一定要使用 `Col` 组件包裹，因此，该场景下尽可能的使用 `generateFn` 即可避免这样繁琐的问题（如果内建组件没有需要的组件，可以试试 `registerComponent` ）。之所以这样是由于该函数由 `Form` 组件去执行，当主动去调用时，`form` 的实例还没与 `Form` 绑定，会报警告：

```
Warning: Instance created by `useForm` is not connect to any Form element. Forget to pass `form` prop?
```

11. 移除上传组件的 `countLimitHint` ，`sizeLimitHint` 和 `imageLimitHint` ，使用国际化的 `hint` 字段实现。
12. 移除 `EditableTable` 组件和 `addDivider` 工具方法。剥离到 [antd-form-mate-editable](https://github.com/zpr1g/antd-form-mate-editable) ，单独安装使用。
13. 替换 `select` ， `check-group` 和 `radio-group` 中选项的 `text` 字段，使用默认的 `label` 字段。
