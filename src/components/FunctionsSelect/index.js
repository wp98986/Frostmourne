import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const Option = Select.Option;

@connect(({ functionmodel, loading }) => ({
  functionmodel,
  loading: loading.models.functionmodel,
}))
class FunctionsSelect extends Component {
  // state = {
  //   site: null,
  // };

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const { dispatch } = this.props;
  //   const { site } = nextProps;
  //   const { site: oldSite } = this.state;
  //   if (site !== oldSite && site) {
  //     this.setState({ site });
  //     dispatch({
  //       type: 'functionmodel/fetch',
  //       payload: {},
  //     });
  //   }
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'functionmodel/fetch',
      payload: {},
    });
  }

  render() {
    const {
      functionmodel: { data },
    } = this.props;
    const { list } = data;
    const children = list.map(service => {
      const { name, id } = service;
      return <Option key={id}>{name}</Option>;
    });
    return (
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="请选择功能模块"
        optionFilterProp="children"
        notFoundContent="暂无数据"
        {...this.props}
      >
        {children}
      </Select>
    );
  }
}

export default FunctionsSelect;
