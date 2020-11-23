import React, { Component } from 'react';
import { Checkbox, Row, Col, Divider } from 'antd';
import _ from 'lodash/array';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;

class FunctionsCheckbox extends Component {
  state = {
    dataSource: [],
    checkedList: [],
    indeterminate: true,
    checkAll: false,
  };

  componentDidMount() {
    const { dataSource } = this.props;
    if (dataSource) this.setState({ dataSource });
  }

  onChange = checkedList => {
    const { dataSource } = this.state;
    const { onChange } = this.props;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < dataSource.length,
      checkAll: checkedList.length === dataSource.length,
    });
    onChange(checkedList);
  };

  onCheckAllChange = e => {
    const { onChange } = this.props;
    const { dataSource } = this.state;
    const Ids = dataSource.map(item => item.id);
    setTimeout(() => {
      this.setState({
        checkedList: e.target.checked ? Ids : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
      const checkedIds = e.target.checked ? Ids : [];
      onChange(checkedIds);
    }, 300);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { initialValue, dataSource: newSource } = nextProps;
    if (newSource.length > 0) {
      this.setState({ dataSource: newSource });
    }
    this.setState({ checkedList: initialValue });
  }

  renderDataDom() {
    const { dataSource } = this.state;
    const { typeSource } = this.props;
    const layout = { md: 24, lg: 12, xl: 12 };
    const dataDom = [];
    const keys = Object.keys(typeSource);
    let newKey = 0;
    keys.forEach(key => {
      let data = dataSource.filter(f => f.docType === key);
      // let data = dataSource.map(f => f);
      data = _.chunk(data, 4);
      const dom = data.map((arr, d) => {
        const keyValue = `row${d}`;
        const items = [];
        arr.map(item => {
          newKey += 1;
          const k = `col${newKey}`;
          items.push(
            <Col key={k} {...layout}>
              <Checkbox value={item.id}>{item.name}</Checkbox>
            </Col>
          );
          return true;
        });
        return (
          <Row key={keyValue} className={styles.checkBoxRow}>
            {items}
          </Row>
        );
      });
      const newDom = [];
      const k = Math.random() * Math.random();
      if (data.length > 0 && keys.indexOf(key) !== typeSource.length - 1)
        newDom.push(<div style={{ marginBottom: 5 }}>{typeSource[key].label}</div>);
      newDom.push(dom);
      if (data.length > 0 && keys.indexOf(key) !== typeSource.length - 1) newDom.push(<Divider />);
      dataDom.push(<div key={k}>{newDom}</div>);
    });
    return dataDom;
  }

  render() {
    const { indeterminate, checkAll, checkedList } = this.state;
    return (
      <div className={styles.checkBox}>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup
          className={styles.checkBoxGroup}
          value={checkedList}
          onChange={this.onChange}
        >
          {this.renderDataDom()}
        </CheckboxGroup>
      </div>
    );
  }
}

export default FunctionsCheckbox;
