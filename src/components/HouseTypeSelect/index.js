import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './index.less';

import colorcheck from '@/assets/colorcheck.png';
import colorcheckwhite from '@/assets/colorcheckwhite.png';

export default class HouseTypeSelect extends PureComponent {
  state = {
    houseTypeList: [],
  };

  constructor(props) {
    super(props);
    const { data, value } = this.props;
    this.state = {
      houseTypeList: props.data || [],
      data, // eslint-disable-line react/no-unused-state
      value, // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { value, data, multiple } = nextProps;
    let newValue = [];
    if (multiple && value) {
      newValue = value;
    } else if (!multiple && value) {
      newValue.push(value);
    }

    const selectData = data.map(({ value: dataValue, ...others }) =>
      newValue && newValue.indexOf(dataValue) >= 0
        ? { ...others, value: dataValue, hasSelect: true }
        : { ...others, value: dataValue }
    );

    return {
      houseTypeList: selectData || [],
      data,
      value,
    };
  }

  componentDidMount() {
    // this.queryHouseTypeList();
  }

  houseTypeClick = houseType => {
    const { houseTypeList } = this.state;
    const { multiple, onChange } = this.props;
    const { value: matchValue } = houseType;
    const newHouseTypeList = houseTypeList.map(({ hasSelect, value, ...others }) =>
      value === matchValue
        ? { ...others, value, hasSelect: !hasSelect }
        : { ...others, value, hasSelect: hasSelect && multiple }
    );

    const selectValue = newHouseTypeList
      .filter(({ hasSelect }) => hasSelect)
      .map(({ value }) => value);

    if (onChange && multiple) {
      onChange(selectValue);
    } else if (onChange && !multiple) {
      onChange(selectValue[0]);
      return;
    }

    this.setState({
      houseTypeList: newHouseTypeList,
    });
  };

  renderColor(item) {
    const { rgb, icon } = item;
    return (
      <div
        key={item.key ? item.key : item.value}
        onClick={() => this.houseTypeClick(item)}
        className={item.hasSelect ? 'selectItemActive selectItem' : 'selectItem'}
      >
        {icon ? (
          <div className="selectColorContainer">
            <div className="selectColor">
              <div className={styles.iconContainer}>
                <img src={icon} alt="" />
                {item.hasSelect ? (
                  <img className={styles.iconCheck} src={colorcheck} alt="" />
                ) : null}
              </div>
            </div>
            <div className="selectColorText">{item.name}</div>
          </div>
        ) : (
          <div className="selectColorContainer">
            <div className={styles.iconContainer}>
              <div
                className={classNames(
                  'selectColor',
                  rgb === '#ffffff' || rgb === '#fdf5e6' ? styles.whiteColor : null
                )}
                style={{ backgroundColor: rgb }}
              />
              {item.hasSelect ? (
                <img
                  className={styles.iconCheck}
                  src={rgb === '#ffffff' || rgb === '#fdf5e6' ? colorcheckwhite : colorcheck}
                  alt=""
                />
              ) : null}
            </div>
            <div className="selectColorText">{item.name}</div>
          </div>
        )}
      </div>
    );
  }

  renderHouseType() {
    const { houseTypeList } = this.state;
    const { type = 'text' } = this.props;
    const housetype = houseTypeList.map(item => {
      if (type === 'color') {
        return this.renderColor(item);
      }

      const imgNode =
        item.img && item.img !== '{}' ? (
          <span className="selectItemImg">
            <img src={item.img} alt="" />
            <span className="selectItemLabel">{item.value}</span>
          </span>
        ) : (
          <span className="selectValueText">{item.value}</span>
        );

      return (
        <div
          key={item.key ? item.key : item.value}
          onClick={() => this.houseTypeClick(item)}
          className={item.hasSelect ? 'selectItemActive selectItem' : 'selectItem'}
        >
          {type === 'text' ? item.title : imgNode}
        </div>
      );
    });
    return housetype;
  }

  render() {
    const { className } = this.props;
    return (
      <div className={classNames(styles.SelectClassName, className)}>
        <div className="selectBox">{this.renderHouseType()}</div>
      </div>
    );
  }
}
