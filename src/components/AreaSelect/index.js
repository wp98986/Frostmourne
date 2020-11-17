import React, { Component } from 'react';
import { Cascader } from 'antd';

import { CITYS, PROVINCE } from './city-data';
import styles from './index.less';

class AreaSelect extends Component {
  componentDidMount() {
    // const { dispatch } = this.props;
    // console.log(dispatch)
    // dispatch({
    //   type: 'chart/clear',
    // });
  }

  componentWillUnmount() {}

  render() {
    const { onlyprovinces, canselect = [] } = this.props;
    let NEWCITYS = [];
    if (canselect.length) {
      for (let i = 0; i < CITYS.length; i += 1) {
        const item = CITYS[i];
        const { value } = item;
        if (value !== canselect[0]) {
          NEWCITYS.push({ ...item, disabled: true });
        } else {
          NEWCITYS.push(item);
        }
      }
    } else {
      NEWCITYS = CITYS;
    }
    return (
      <Cascader
        className={styles.cascader}
        options={onlyprovinces ? PROVINCE : NEWCITYS}
        placeholder="请选择所在区域"
        {...this.props}
      />
    );
  }
}

export default AreaSelect;
