import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class SexSelect extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="请选择性别"
        optionFilterProp="children"
        notFoundContent="暂无数据"
        {...this.props}
      >
        <Option key="男">男</Option>
        <Option key="女">女</Option>
      </Select>
    );
  }
}

export default SexSelect;
