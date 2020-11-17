import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class AppSelect extends Component {
  componentDidMount() {}

  render() {
    const { dataSource } = this.props;
    const children = dataSource.map(service => {
      const { name, id } = service;
      return <Option key={id}>{name}</Option>;
    });
    return (
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="请选择应用"
        optionFilterProp="children"
        notFoundContent="暂无数据"
        {...this.props}
      >
        {children}
      </Select>
    );
  }
}

export default AppSelect;
