import React, { PureComponent } from 'react';
import { Select } from 'antd';

import { pinyinFilterOption } from '@/utils/selectHelper';

const Option = Select.Option;

class SelectEnum extends PureComponent {
  render() {
    const { data } = this.props;
    const children = [];
    const values = Object.values(data);
    for (let i = 0; i < values.length; i++) {
      if (typeof values[i] === 'object') {
        children.push(<Option key={values[i].key}>{values[i].label}</Option>);
      }
    }
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        filterOption={pinyinFilterOption}
        allowClear
        placeholder="请选择"
        {...this.props}
      >
        {children}
      </Select>
    );
  }
}
export default SelectEnum;
