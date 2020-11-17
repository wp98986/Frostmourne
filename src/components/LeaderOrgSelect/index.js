import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class LeaderOrgSlect extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let { list } = this.props;
    if (!list) list = [];
    const children = list.map(service => {
      const { orgName, id } = service;
      return <Option key={id}>{orgName}</Option>;
    });
    return (
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="请选择上级单位"
        optionFilterProp="children"
        notFoundContent="暂无数据"
        {...this.props}
      >
        {children}
      </Select>
    );
  }
}

export default LeaderOrgSlect;
