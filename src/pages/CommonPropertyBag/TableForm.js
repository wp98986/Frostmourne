import React, { PureComponent, Fragment } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Table, Button, Input, Popconfirm, Radio } from 'antd';
import SelectEnum from '@/components/SelectEnum';
import isEqual from 'lodash/isEqual';
import PropertyBagConstant from '@/constants/PropertyBagConstant';
import styles from './CommonPropertyBag.less';

const RadioGroup = Radio.Group;
const { valueTypeEnum } = PropertyBagConstant;

class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  getFormValue() {
    const { data = [] } = this.state;
    const { type } = this.props;
    if (type === 'single') {
      let newData = '';
      data.map((item, index) => {
        if (index !== data.length - 1) {
          newData += `${item.value},`;
        } else {
          newData += item.value;
        }
        return item;
      });
      return newData;
    }
    return data;
  }

  newMember = () => {
    const { data } = this.state;
    const { type } = this.props;
    const newData = data.map(item => ({ ...item }));
    if (type === 'single') {
      newData.push({
        key: `NEW_TEMP_ID_${this.index}`,
        value: '',
      });
    } else {
      newData.push({
        key: `NEW_TEMP_ID_${this.index}`,
        name: '',
        sortNo: '',
        type: '',
        optionValue: '',
        defaultValue: '',
        isRequired: true,
        remark: '',
      });
    }
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (!e.target) {
        target[fieldName] = e;
      } else {
        let value = e.target.value;
        if (fieldName === 'optionValue') {
          value = value.replace(/，/g, ',');
        }
        target[fieldName] = value;
      }
      this.setState({ data: newData });
    }
  }

  handleChange(e, fieldName, index) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData[index][fieldName] = e.target.value;
    this.setState({ data: newData });
  }

  render() {
    const { type } = this.props;
    const yes = true;
    const advancedColumns = [
      {
        title: '属性名',
        dataIndex: 'name',
        key: 'name',
        width: '15%',
        className: styles.required,
        render: (text, record) => (
          <Input
            disabled={record.id}
            value={text}
            autoFocus
            onChange={e => this.handleFieldChange(e, 'name', record.key)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            placeholder="属性名"
          />
        ),
      },
      {
        title: '可选范围',
        dataIndex: 'optionValue',
        key: 'optionValue',
        width: '20%',
        className: styles.required,
        render: (text, record) => (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'optionValue', record.key)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            placeholder="范围之间用英文逗号隔开"
          />
        ),
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        key: 'defaultValue',
        width: '10%',
        render: (text, record) => (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'defaultValue', record.key)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            placeholder="填写默认值"
          />
        ),
      },
      {
        title: '排序号',
        dataIndex: 'sortNo',
        key: 'sortNo',
        width: '10%',
        render: (text, record) => (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'sortNo', record.key)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            placeholder="排序号"
          />
        ),
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: '10%',
        className: styles.required,
        render: (text, record) => (
          <SelectEnum
            value={text}
            data={valueTypeEnum}
            onChange={e => this.handleFieldChange(e, 'type', record.key)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            placeholder="类型"
          />
        ),
      },
      {
        title: '是否必填',
        dataIndex: 'isRequired',
        key: 'isRequired',
        width: '15%',
        render: (text, record) => {
          let defaultValue = text;
          if (text === undefined) defaultValue = false;
          return (
            <RadioGroup
              onChange={e => this.handleFieldChange(e, 'isRequired', record.key)}
              value={defaultValue}
            >
              <Radio value={yes}>是</Radio>
              <Radio value={false}>否</Radio>
            </RadioGroup>
          );
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '15%',
        render: (text, record) => (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'remark', record.key)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            placeholder="备注"
          />
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (record.id) return null;
          return (
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const singleColumns = [
      {
        title: '属性值',
        dataIndex: 'value',
        key: 'value',
        width: '20%',
        className: styles.required,
        render: (text, record, index) => (
          <Input
            value={text}
            onChange={e => this.handleChange(e, 'value', index)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            placeholder="填写属性值"
          />
        ),
      },
    ];

    const installServiceColumns = [
      {
        title: '属性名',
        dataIndex: 'name',
        key: 'name',
        className: styles.required,
        render: (text, record) => (
          <Input
            value={text}
            autoFocus
            onChange={e => this.handleFieldChange(e, 'name', record.key)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            placeholder="属性名"
          />
        ),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: (text, record) => (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'remark', record.key)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            placeholder="备注"
          />
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    let columns = advancedColumns;
    if (type === 'single') {
      columns = singleColumns;
    }
    if (type === 'product') {
      columns = installServiceColumns;
    }
    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon={<PlusOutlined />}
        >
          添加
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
