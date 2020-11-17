import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import CITYS from '@/constants/basicConstant';
import styles from './index.less';

const { Option } = Select;

const nullSlectItem = {
  label: '',
  key: '',
};

class GeographicSelect extends PureComponent {
  componentDidMount = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'geographic/fetchProvince',
    // });
  };

  getProvinceOption = () => {
    // const keys = Object.keys(CITYS);
    const keys = [];
    for (let i; i < CITYS.length; i++) {
      keys.push(CITYS[i]);
    }
    const provinceEnum = keys.map(i => i);
    return this.getOption(provinceEnum);
  };

  getCityOption = () => {
    const cityEnum = CITYS.map(i => i);
    return this.getOption(cityEnum);
  };

  getDistrictOption = () => {};

  getOption = list => {
    if (!list || list.length < 1) {
      return (
        <Option key={0} value={0}>
          没有找到选项
        </Option>
      );
    }
    return list.map(item => (
      <Option key={item.name} value={item.name}>
        {item.name}
      </Option>
    ));
  };

  selectProvinceItem = item => {
    const { dispatch, onChange } = this.props;
    dispatch({
      type: 'geographic/fetchCity',
      payload: item.key,
    });
    onChange({
      province: item,
      city: nullSlectItem,
    });
  };

  selectCityItem = item => {
    const { value, onChange } = this.props;
    onChange({
      province: value.province,
      city: item,
    });
  };

  conversionObject() {
    const { value } = this.props;
    if (!value) {
      return {
        province: nullSlectItem,
        city: nullSlectItem,
      };
    }
    const { province, city } = value;
    return {
      province: province || nullSlectItem,
      city: city || nullSlectItem,
    };
  }

  render() {
    const { province, city } = this.conversionObject();
    // const { isLoading } = this.props;
    return (
      <Spin spinning={false} wrapperClassName={styles.row}>
        <Select
          className={styles.item}
          value={province}
          labelInValue
          showSearch
          onSelect={this.selectProvinceItem}
        >
          {this.getProvinceOption()}
        </Select>
        <Select
          className={styles.item}
          value={city}
          labelInValue
          showSearch
          onSelect={this.selectCityItem}
        >
          {this.getCityOption()}
        </Select>
        <Select
          className={styles.item}
          value={city}
          labelInValue
          showSearch
          onSelect={this.selectCityItem}
        >
          {this.getDistrictOption()}
        </Select>
      </Spin>
    );
  }
}

export default GeographicSelect;
