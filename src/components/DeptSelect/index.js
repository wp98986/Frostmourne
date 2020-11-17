import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class DeptSelect extends Component {
  componentDidMount() {}

  render() {
    let { dataSource } = this.props;
    if (!dataSource) dataSource = [];
    const children = dataSource.map(dept => {
      const { name, id } = dept;
      return <Option key={id}>{name}</Option>;
    });
    return (
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="请选择管理部门"
        optionFilterProp="children"
        notFoundContent="暂无数据"
        {...this.props}
      >
        {children}
      </Select>
    );
  }
}

export default DeptSelect;
