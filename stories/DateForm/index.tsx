import * as React from 'react';
// import { action } from '@storybook/addon-actions';
import moment from 'moment';
import { Button, Space } from 'antd';

import FormMate from '../../src';

const { useEffect } = React;
const dateFormat = 'YYYY-MM-DD';
const datetimeFormat = 'YYYY-MM-DD HH:mm:ss';

export default () => {
  const [formMate] = FormMate.useFormMate();

  const initialValues = {
    formatDate: moment().format(dateFormat),
    unix: 1565151166,
    ms: 1565151166124,
    datetime: moment().format(datetimeFormat),
    'date-period': ['2019-01-01 12:00:00', '2019-08-07 10:00:00'],
    'datetime-period': ['2019-01-01', '2019-08-07'],
  };

  useEffect(() => {
    formMate.setInitialValues(initialValues);
  }, []);

  const handleFinish = () => {
    const rawValues = formMate.getFieldsValue(true);
    console.log('Received raw values of form: ', rawValues);
    // 过滤，得到当前显示组件的字段值
    const values = formMate.getFieldsValue(undefined, () => true);
    console.log('Received values of form: ', values);
  };

  const handleFinishFailed = (errors) => {
    console.log('Errors:', errors);
  };

  return (
    <FormMate
      formMate={formMate}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      // initialValues={initialValues}
      onValuesChange={(changedValues, allValues) => {
        console.log('onValuesChange', changedValues, allValues);
      }}
      style={{
        maxWidth: 900,
        margin: '0 auto',
        paddingTop: 20,
      }}
      // layout='vertical'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 12 }}
      onReset={() => {
        formMate.resetFieldsValue();
      }}
    >
      <FormMate.Item type='date' name='formatDate' label='格式化日期' />
      <FormMate.Item type='date' name='unix' label='unix 时间戳' />
      <FormMate.Item type='date' name='ms' label='毫秒时间戳' />
      <FormMate.Item
        type='datetime'
        name='datetime'
        label='日期时间'
        componentProps={{
          disabledPastDays: true,
        }}
      />
      <FormMate.Item type='date-range' name='date-period' label='日期区间' />
      <FormMate.Item type='datetime-range' name='datetime-period' label='日期时间区间' />
      <FormMate.Item wrapperCol={{ span: 12, offset: 8 }}>
        <Space>
          <Button type='primary' htmlType='submit'>
            提交
          </Button>
          <Button htmlType='reset'>重置</Button>
        </Space>
      </FormMate.Item>
    </FormMate>
  );
};
