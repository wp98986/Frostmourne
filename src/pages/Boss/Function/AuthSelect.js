import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { pinyinFilterOption } from '@/utils/selectHelper';

const { Option } = Select;

export default class AuthSelect extends PureComponent {
  render() {
    const { data: authList, ...others } = this.props;
    const authItems = authList.map(({ value, name }) => (
      <Option key={value} value={value}>
        {name}
      </Option>
    ));

    return (
      <Select
        placeholder="请选择"
        mode="multiple"
        filterOption={pinyinFilterOption}
        autoClearSearchValue={false}
        style={{ width: '100%' }}
        {...others}
      >
        {authItems}
      </Select>
    );
  }
}
