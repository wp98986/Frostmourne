import React, { Component } from 'react';
import { Link } from 'umi';
// import { Select } from 'antd';
import styles from './index.less';

class TopRightContent extends Component {
  componentDidMount() {}

  render() {
    let customer = JSON.parse(localStorage.getItem('customer'));
    if (!customer) customer = {};
    const { name = '', id = '', code = '' } = customer;
    let custDom;
    if (code && id) {
      custDom = <Link to={`/customer/edit/${id}`}>{name || code}</Link>;
    } else {
      custDom = <span>暂无客户</span>;
    }
    return <div className={styles.container}>{custDom}</div>;
  }
}

export default TopRightContent;
