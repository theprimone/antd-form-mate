import React, { useState } from 'react';
import { Button, Divider, Form } from 'antd';
import moment from 'moment';
import EditableTable from '../../src/lib/components/EditableTable';

const genderOptions = [
  {
    text: '男',
    value: 1,
  },
  {
    text: '女',
    value: 2,
  },
];

export default () => {
  const [form] = Form.useForm();
  const [
    editingKey,
    setEditingKey,
  ] = useState();
  return (
    <div style={{ width: 900, margin: '48px auto 0' }}>
      <EditableTable
        form={form}
        initialValues={{
          name: "xxx",
          gender: 1
        }}
        columns={[
          {
            title: '姓名',
            dataIndex: 'name',
            formItemConfig: {
              type: 'string',
              // fieldProps: {
              //   initialValue: "xxx",
              // }
            },
          },
          {
            title: '性别',
            dataIndex: 'gender',
            formItemConfig: {
              type: 'select',
              // fieldProps: {
              //   initialValue: 1,
              // },
              componentProps: {
                options: genderOptions,
              },
            },
          },
          {
            title: '生日',
            dataIndex: 'birthday',
            render: (value) => {
              if (value) {
                return moment(value).format('YYYY-MM-DD');
              }
              return '-';
            },
            formItemConfig: {
              type: 'date',
              formItemProps: {
                rules: [
                  { required: true },
                ],
              }
            },
          },
        ]}
        initialData={[
          {
            id: 123,
            gender: 1,
            name: 'xys',
            birthday: null,
          },
          {
            id: 23,
            gender: 2,
            name: 'theprimone',
            birthday: null,
          },
        ]}
        onCreate={async (record) => {
          console.log('create record', record);
        }}
        onUpdate={async (record) => {
          console.log('update record', record);
        }}
        onDelete={async (record) => {
          console.log('delete record', record);
        }}
        onDataChange={(data) => {
          console.log(data);
        }}
        onCancel={(prevRecord, record) => {
          console.log(prevRecord, record);
        }}
        editingKey={setEditingKey}
      />
      <Divider />
      <Button
        type='primary'
        onClick={() => alert(`editingKey: ${editingKey}`)}
      >
        Alert editingKey
      </Button>
    </div>
  )
}
