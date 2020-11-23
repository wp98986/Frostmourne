import React, { Component, Fragment } from 'react';
import { connect, history } from 'umi';

import { Card, Table, Button, message, Modal } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PropertyBagConstant from '@/constants/PropertyBagConstant';
import styles from './PropertyBag.less';

const { valueTypeEnum, typeEnum } = PropertyBagConstant;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

const propertyColumns = [
  {
    title: '属性名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '可选范围',
    dataIndex: 'optionValue',
    key: 'optionValue',
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: val => (valueTypeEnum[val] ? valueTypeEnum[val].label : ''),
  },
  {
    title: '排序号',
    dataIndex: 'sortNo',
    key: 'sortNo',
  },
  {
    title: '是否必填',
    dataIndex: 'isRequired',
    key: 'isRequired',
    render: val => (val ? '是' : '否'),
  },
];

@connect(({ propertybag, loading }) => ({
  propertybag,
  loading: loading.effects['propertybag/fetchView'],
}))
class PropertyBagView extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const id = this.getId();
    dispatch({
      type: 'propertybag/fetchView',
      payload: { id },
    });
  }

  getId = () => {
    const { match } = this.props;
    const id = get(match, 'params.id');
    return id;
  };

  toEdit = () => {
    const id = this.getId();
    history.push(`/setting/propertybag/edit/${id}`);
  };

  del = () => {
    const { dispatch } = this.props;
    const id = this.getId();
    confirm({
      title: '确认',
      content: '请确认删除属性包',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'propertybag/delete',
          payload: { id },
          callback: result => {
            const { data } = result;
            if (data.code === '203') {
              message.success('删除成功');
              history.push('/setting/propertybag');
            } else {
              let msg = '';
              if (data.message) msg = `，${data.message}`;
              message.error(`删除失败${msg}`);
            }
          },
        });
      },
    });
  };

  render() {
    const {
      propertybag: { view },
      loading,
    } = this.props;
    let propertys = get(view, 'propertys');
    if (!propertys) propertys = [];
    let name;
    let code;
    let isValid;
    let remark;
    let type;
    if (view && Object.keys(view).length) {
      name = get(view, 'name');
      code = get(view, 'code');
      isValid = get(view, 'isValid');
      remark = get(view, 'remark');
      type = get(view, 'type');
      if (type && typeEnum[type]) type = typeEnum[type].label;
    }
    const action = (
      <Fragment>
        <ButtonGroup>
          <Button onClick={this.toEdit}>编辑</Button>
          <Button onClick={this.del}>删除</Button>
        </ButtonGroup>
      </Fragment>
    );
    return (
      <PageHeaderWrapper
        title="属性包详情"
        content="属性包基础信息以及具体属性内容"
        action={action}
      >
        <Card bordered={false} className={styles.card}>
          <DescriptionList size="large" title="基础信息">
            <Description term="属性包名">{name}</Description>
            <Description term="编码">{code}</Description>
            <Description term="类型">{type}</Description>
            <Description term="是否有效">{isValid ? '是' : '否'}</Description>
            <Description term="备注">{remark}</Description>
          </DescriptionList>
        </Card>
        <Card bordered={false}>
          <div className={styles.title}>客户标签</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={propertys}
            columns={propertyColumns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PropertyBagView;
