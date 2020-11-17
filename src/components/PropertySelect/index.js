import React, { Component } from 'react';
import { Radio, Select } from 'antd';
import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class PropertySelect extends Component {
  componentDidMount() {}

  render() {
    const { dataSource, type } = this.props;
    const values = dataSource.split(',');
    let children;
    if (type === 'radio') {
      children = values.map(item => <RadioButton key={item}>{item}</RadioButton>);
    } else {
      children = values.map(item => (
        <Option key={item} value={item}>
          {item}
        </Option>
      ));
    }
    return (
      <div>
        {type === 'radio' ? (
          <RadioGroup
            className={styles.radio}
            showSearch
            style={{ width: '100%' }}
            optionFilterProp="children"
            notFoundContent="暂无数据"
            {...this.props}
          >
            {children}
          </RadioGroup>
        ) : (
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="请选择"
            optionFilterProp="children"
            notFoundContent="暂无数据"
            {...this.props}
          >
            {children}
          </Select>
        )}
      </div>
    );
  }
}

export default PropertySelect;
