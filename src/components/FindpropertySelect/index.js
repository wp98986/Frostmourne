import React, { PureComponent } from 'react';
import { Select } from 'antd';

import { pinyinFilterOption } from '@/utils/selectHelper';

const Option = Select.Option;

class FindpropertySelect extends PureComponent {
  render() {
    const { data } = this.props;
    const { optionValue = '', type } = data;
    const selectOption = optionValue.split(',').filter(i => i && i.trim()) || [];
    const children = selectOption.map(item => <Option key={item}>{item}</Option>);
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        filterOption={pinyinFilterOption}
        allowClear
        mode={type === 'checkbox' ? 'multiple' : undefined}
        placeholder="请选择"
        {...this.props}
      >
        {children}
      </Select>
    );
  }
}
export default FindpropertySelect;
