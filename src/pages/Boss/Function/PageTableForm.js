import React, { PureComponent, Fragment } from 'react';
import { Table } from 'antd';
import isEqual from 'lodash/isEqual';

import SelectEnum from '@/components/SelectEnum';

class PageTableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.value === key)[0];
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => item);
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target ? e.target.value : e;
      this.setState({ data: newData });
    }
  }

  render() {
    const columns = [
      {
        title: '页面',
        dataIndex: 'title',
        key: 'title',
        width: '20%',
      },
      {
        title: '按钮',
        dataIndex: 'btns',
        key: 'btns',
        width: '20%',
        render: (text, { btnDatas, value, btns }) => (
          <SelectEnum
            mode="multiple"
            value={btns}
            onChange={e => this.handleFieldChange(e, 'btns', value)}
            data={btnDatas}
          />
        ),
      },
    ];

    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          rowKey="value"
          dataSource={data}
          pagination={false}
        />
      </Fragment>
    );
  }
}

export default PageTableForm;
