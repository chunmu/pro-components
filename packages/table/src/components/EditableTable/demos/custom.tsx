import React, { useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { Button, Input, Space, Tag, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormField } from '@ant-design/pro-form';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const TagList: React.FC<{
  value?: {
    key: string;
    label: string;
  }[];
  onChange?: (
    value: {
      key: string;
      label: string;
    }[],
  ) => void;
}> = ({ value, onChange }) => {
  const ref = useRef<Input | null>(null);
  const [newTags, setNewTags] = useState<
    {
      key: string;
      label: string;
    }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...(value || [])];
    if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
      tempsTags = [...tempsTags, { key: `new-${tempsTags.length}`, label: inputValue }];
    }
    onChange?.(tempsTags);
    setNewTags([]);
    setInputValue('');
  };

  return (
    <Space>
      {(value || []).concat(newTags).map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      <Input
        ref={ref}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    </Space>
  );
};

type DataSourceType = {
  id: React.Key;
  title?: string;
  labels?: {
    key: string;
    label: string;
  }[];
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '???????????????',
    labels: [{ key: 'woman', label: '?????????' }],
    state: 'open',
    created_at: '2020-05-26T09:42:56Z',
  },
  {
    id: 624691229,
    title: '???????????????',
    labels: [{ key: 'man', label: '????????????' }],
    state: 'closed',
    created_at: '2020-05-26T08:19:22Z',
  },
];

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '????????????',
    dataIndex: 'title',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '??????????????????',
        },
      ],
    },
    width: '30%',
  },
  {
    title: '??????',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '??????', status: 'Default' },
      open: {
        text: '?????????',
        status: 'Error',
      },
      closed: {
        text: '?????????',
        status: 'Success',
      },
    },
  },
  {
    title: '??????',
    dataIndex: 'labels',
    width: '20%',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '??????????????????',
        },
      ],
    },
    renderFormItem: (_, { isEditable }) => {
      return isEditable ? <TagList /> : <Input />;
    },
    render: (_, row) => row?.labels?.map((item) => <Tag key={item.key}>{item.label}</Tag>),
  },
  {
    title: '??????',
    valueType: 'option',
    width: 250,
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        ??????
      </a>,
      <EditableProTable.RecordCreator
        key="copy"
        record={{
          ...record,
          id: (Math.random() * 1000000).toFixed(0),
        }}
      >
        <a>?????????????????????</a>
      </EditableProTable.RecordCreator>,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();
  return (
    <>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            actionRef.current?.addEditRecord?.({
              id: (Math.random() * 1000000).toFixed(0),
              title: '????????????',
            });
          }}
          icon={<PlusOutlined />}
        >
          ????????????
        </Button>
        <Button
          key="rest"
          onClick={() => {
            form.resetFields();
          }}
        >
          ????????????
        </Button>
      </Space>

      <EditableProTable<DataSourceType>
        rowKey="id"
        actionRef={actionRef}
        headerTitle="???????????????"
        maxLength={5}
        // ???????????????????????????
        recordCreatorProps={false}
        columns={columns}
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true,
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          form,
          editableKeys,
          onSave: async () => {
            await waitTime(2000);
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
      <ProCard title="????????????" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
};
