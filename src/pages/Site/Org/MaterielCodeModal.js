import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Table, Button, message, Popconfirm, Divider } from 'antd';
import DropDownSelect from '@/components/DropDownSelect';

import styles from './OrgInfo.less';

@connect(
  ({ orgInfo, user, loading }) => {
    const { inviteCodeList } = orgInfo;
    return {
      inviteCodeList,
      currentUser: user.currentUser,
      loading: loading.effects['orgInfo/fetchInviteCodeList'],
      saveLoading: loading.effects['orgInfo/saveCode'],
      delLoading: loading.effects['orgInfo/delCode'],
    };
  },
  null,
  null,
  { withRef: true }
)
class MaterielCodeModal extends Component {
  index = 0;

  cacheOriginData = {};

  state = {
    visible: false,
  };

  getRowByKey(key, newData) {
    const { inviteCodeList } = this.props;
    return (newData || inviteCodeList).filter(item => item.key === key || item.id === key)[0];
  }

  showModal = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: true,
    });
    dispatch({
      type: 'orgInfo/fetchInviteCodeList',
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  newMember = () => {
    const { dispatch } = this.props;
    const newItem = {
      key: `NEW_TEMP_ID_${this.index}`,
      editable: true,
      isNew: true,
    };
    this.index += 1;
    dispatch({
      type: 'orgInfo/addCodeList',
      payload: newItem,
    });
  };

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { dispatch, inviteCodeList } = this.props;
    // const { data } = this.state;
    const newData = inviteCodeList.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      dispatch({
        type: 'orgInfo/setCodeList',
        payload: newData,
      });
    }
  };

  handleFieldChange(e, fieldName, key) {
    const { inviteCodeList, dispatch } = this.props;
    const newData = inviteCodeList.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      // this.setState({ data: newData });
      dispatch({
        type: 'orgInfo/setCodeList',
        payload: newData,
      });
    }
  }

  saveRow(e, key) {
    e.persist();
    const { dispatch } = this.props;
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(key) || {};
    if (!target.protocolId) {
      message.error('请选择企业协议。');
      e.target.focus();
      return;
    }
    dispatch({
      type: 'orgInfo/saveCode',
      payload: target,
      callback: res => {
        const { data: { code, message: errorMessage } = {} } = res;
        if (code === '203') {
          dispatch({
            type: 'orgInfo/fetchInviteCodeList',
          });
          delete target.isNew;
          this.toggleEditable(e, key);
        } else {
          message.error(errorMessage);
        }
      },
    });
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { dispatch, inviteCodeList } = this.props;
    // const { data } = this.state;
    const newData = inviteCodeList.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    dispatch({
      type: 'orgInfo/setCodeList',
      payload: newData,
    });
    this.clickedCancel = false;
  }

  remove(key, arg) {
    const { inviteCodeList, dispatch } = this.props;
    let newData;
    if (arg === 'isNew') {
      newData = inviteCodeList.filter(item => item.key !== key);
      dispatch({
        type: 'orgInfo/setCodeList',
        payload: newData,
      });
    } else {
      dispatch({
        type: 'orgInfo/delCode',
        payload: { id: key },
        callback: res => {
          const { data: { code, message: errorMessage } = {} } = res;
          if (code === '203') {
            newData = inviteCodeList.filter(item => item.id !== key);
            dispatch({
              type: 'orgInfo/setCodeList',
              payload: newData,
            });
          } else {
            message.error(errorMessage);
          }
        },
      });
    }
    // onChange(newData);
  }

  render() {
    const { visible } = this.state;
    const { protocolData = [], inviteCodeList, loading, saveLoading, delLoading } = this.props;
    const columns = [
      {
        title: '邀请码',
        dataIndex: 'inviteCode',
        key: 'inviteCode',
        // width: '20%',
      },
      {
        title: '企业协议',
        dataIndex: 'protocolId',
        key: 'protocolId',
        width: 300,
        render: (text, record) => {
          if (record.editable) {
            return (
              <DropDownSelect
                value={record.protocolId ? String(record.protocolId) : null}
                data={protocolData}
                onChange={e => this.handleFieldChange(e, 'protocolId', record.id || record.key)}
              />
            );
          }
          const { protocol: { name } = {} } = record;
          return name;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdate',
        key: 'createdate',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm') : null),
        // width: '40%',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          // const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="是否要删除此行？"
                    onConfirm={() => this.remove(record.key, 'isNew')}
                  >
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.id)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.id)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    return (
      <Modal
        title="物料码"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        wrapClassName={styles.materCodeModal}
        footer={[
          <Button type="primary" onClick={this.handleCancel}>
            取消
          </Button>,
        ]}
      >
        <div>
          <Table
            loading={loading || saveLoading || delLoading}
            columns={columns}
            dataSource={inviteCodeList}
            pagination={false}
            rowKey={record => record.id || record.key}
          />
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon={<PlusOutlined />}
          >
            添加
          </Button>
        </div>
      </Modal>
    );
  }
}

export default MaterielCodeModal;
