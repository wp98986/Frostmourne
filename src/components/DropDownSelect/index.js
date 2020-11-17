import React, { PureComponent } from 'react';
import { Select } from 'antd';

import { pinyinFilterOption } from '@/utils/selectHelper';

const Option = Select.Option;

class BasicSelect extends PureComponent {
  render() {
    const { data: dataSource = [] } = this.props;
    const children = dataSource.map(item => {
      const { key, label } = item;
      if (key) {
        return <Option key={key}>{label}</Option>;
      }
      return null;
    });
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
export default BasicSelect;
