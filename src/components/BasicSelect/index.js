import React, { PureComponent } from 'react';
import { Select } from 'antd';

// import { pinyinFilterOption } from '@/utils/selectHelper';

const Option = Select.Option;

class BasicSelect extends PureComponent {
  render() {
    const { dataSource = [], designerStore, labelName } = this.props;
    const children = dataSource.map(item => {
      const { name, id, value, store: { name: storeName = '' } = {} } = item;
      let label = name;
      if (designerStore) {
        label = `${storeName}-${name}`;
      }
      if (labelName) label = item[labelName];
      const key = id || value;
      return <Option key={key}>{label}</Option>;
    });
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        filterOption={false}
        allowClear
        placeholder="请选择"
        {...this.props}
      >
        {children}
      </Select>
    );
  }
}
export default BasicSelect;
