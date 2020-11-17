import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import classNames from 'classnames';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, message, Modal, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';
import DropDownSelect from '@/components/DropDownSelect';
import { validatorPhone } from '@/utils/formUtils';
// import { getBtns } from '@/utils/authority';
import MaterielCodeModal from './MaterielCodeModal';
import iconSearch from '@/assets/designer/icon/search.png';

import styles from './OrgInfo.less';

const FormItem = Form.Item;

const tabEnums = [
  { key: 'all', label: '全部' },
  { key: 'false', label: '已注册' },
  { key: 'true', label: '未注册' },
];

@connect(({ orgInfo, user, loading }) => ({
  orgInfo,
  currentUser: user.currentUser,
  loading: loading.effects['orgInfo/fetchInvite'],
  changeLoading: loading.effects['orgInfo/changeProto'],
}))
@Form.create()
class InvitedOrg extends PureComponent {
  newList = [];

  cacheOriginData = {};

  state = {
    page: 1,
    pageSize: 10,
    activeTab: 'all',
    visible: false,
    protoRemark: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfo/fetchCurrentProtocols',
    });
    this.loadList();
  }

  getId = () => {
    const { match } = this.props;
    const id = get(match, 'params.id');
    return id;
  };

  getRowByKey(key, newData) {
    const {
      orgInfo: { orgs: { modelList = [] } = {} },
    } = this.props;
    return (newData || modelList).filter(item => item.id === key)[0];
  }

  loadList = () => {
    const { page, pageSize, activeTab, keyWords } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfo/fetchInvite',
      payload: {
        page,
        pageSize,
        enableFlag: activeTab !== 'all' ? activeTab : undefined,
        searchParam: keyWords !== '' ? keyWords : undefined,
      },
    });
  };

  pageChange = pagination => {
    this.setState({
      page: pagination.current,
    });
    setTimeout(() => {
      this.loadList();
    }, 100);
  };

  tabClick = activeTab => {
    this.setState({ activeTab, keyWords: null });
    setTimeout(() => {
      this.loadList(1);
    }, 100);
  };

  inputChange = e => {
    const value = e.target.value;
    this.setState({
      keyWords: value,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  closeInviteModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
      protoRemark: null,
    });
  };

  listProtoChange = (e, fieldName, key) => {
    const {
      orgInfo: { orgs: { modelList = [] } = {} },
      dispatch,
    } = this.props;
    const newData = modelList.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e || '';
      dispatch({
        type: 'orgInfo/setInviteList',
        payload: newData,
      });
    }
  };

  protoChange = e => {
    const { orgInfo: { protocols = [] } = {} } = this.props;
    const currentProto = protocols.find(item => item.id === Number(e)) || {};
    const { remark } = currentProto;
    this.setState({
      protoRemark: remark,
    });
  };

  invite = record => {
    const {
      dispatch,
      currentUser: {
        data: {
          user: { id: userId },
        },
      } = {},
    } = this.props;
    const {
      invitePeople,
      inviteMobile,
      inviteCode,
      contact,
      mobile,
      srcInviteCode,
      protocolId,
    } = record;
    const that = this;
    dispatch({
      type: 'orgInfo/invite',
      payload: {
        userId,
        inviteCode: inviteCode || srcInviteCode,
        invitePeople: invitePeople || contact,
        inviteMobile: inviteMobile || mobile,
        protocolId,
      },
      callback: result => {
        const { data } = result;
        if (data.code === '203') {
          message.success('发送成功');
          that.loadList();
          this.handleCancel();
        } else {
          let msg = '';
          if (data.message) msg = `，${data.message}`;
          message.error(`发送失败${msg}`);
        }
      },
    });
  };

  handleOk = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((err, fields) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'user/invitePerson',
        payload: { ...fields },
        callback: result => {
          const { data } = result;
          if (data.code === '203') {
            message.success('发送邀请成功');
            this.loadList();
            this.closeInviteModal();
          } else {
            message.error(`发送失败，${data.message}`);
          }
        },
      });
    });
  };

  showMaterielModal = () => {
    this.materieCode.showModal();
  };

  toggleEditable = (e, key) => {
    e.preventDefault();
    const {
      orgInfo: { orgs: { modelList = [] } = {} },
      dispatch,
    } = this.props;
    const newData = modelList.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      dispatch({
        type: 'orgInfo/setInviteList',
        payload: newData,
      });
    }
  };

  cancleEditInvite(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const {
      orgInfo: { orgs: { modelList = [] } = {} },
      dispatch,
    } = this.props;
    // const { data } = this.state;
    const newData = modelList.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    dispatch({
      type: 'orgInfo/setInviteList',
      payload: newData,
    });
    this.clickedCancel = false;
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
      type: 'orgInfo/changeProto',
      payload: target,
      callback: res => {
        const { data: { code, message: errorMessage } = {} } = res;
        if (code === '203') {
          this.loadList();
          delete target.isNew;
          this.toggleEditable(e, key);
        } else {
          message.error(errorMessage);
        }
      },
    });
  }

  renderTabs() {
    const { activeTab, keyWords } = this.state;
    const tabNode = tabEnums.map(item => {
      const { label, key } = item;
      return (
        <div
          key={key}
          onClick={() => this.tabClick(key)}
          className={classNames(styles.tabItem, activeTab === key ? styles.tabItemActive : null)}
        >
          {label}
        </div>
      );
    });
    return (
      <div className={styles.tabContainer}>
        <div className={styles.tabNodeList}>{tabNode}</div>
        <Input
          value={keyWords}
          className={styles.tabInput}
          placeholder="输入联系人姓名或手机号码"
          onChange={this.inputChange}
          onPressEnter={() => this.loadList(1)}
          addonAfter={<img onClick={() => this.loadList(1)} src={iconSearch} alt="" />}
        />
      </div>
    );
  }

  render() {
    const {
      orgInfo: { orgs: { modelList = [], totalCount = '' } = {}, protocols = [] },
      loading,
      changeLoading,
      form: { getFieldDecorator },
    } = this.props;
    const { page, pageSize, visible, protoRemark } = this.state;
    const data = { list: modelList };
    const pagination = { total: totalCount, pageSize, current: page };
    const protocolsData = protocols.map(item => ({
      label: item.name,
      key: item.id,
    }));
    const columns = [
      {
        title: '联系人',
        dataIndex: 'invitePeople',
        render: (text, record) => {
          const { contact } = record;
          return text || contact;
        },
      },
      {
        title: '联系电话',
        dataIndex: 'inviteMobile',
        render: (text, record) => {
          const { mobile } = record;
          return text || mobile;
        },
      },
      {
        title: '状态',
        dataIndex: 'orgId',
        render: (text, record) => {
          const { orgId } = record;
          if (orgId) {
            return <span className={styles.registed}>已注册</span>;
          }
          return <span className={styles.noregist}>未注册</span>;
        },
      },

      {
        title: '邀请时间',
        dataIndex: 'inviteDate',
        key: 'inviteDate',
        width: '14%',
        align: 'center',
        render: (text, record) => {
          const { inviteDate, registerDate } = record;
          const dat = inviteDate || registerDate;
          return <span>{dat ? moment(dat).format('YYYY-MM-DD HH:mm') : ''}</span>;
        },
      },
      {
        title: '邀请码',
        dataIndex: 'inviteCode',
        key: 'inviteCode',
        align: 'center',
        render: (text, record) => {
          const { inviteCode, srcInviteCode } = record;
          return inviteCode || srcInviteCode;
        },
      },
      {
        title: '企业协议',
        dataIndex: 'protocolName',
        key: 'protocolName',
        align: 'center',
        render: (text, record) => {
          const { editable, protocolId } = record;
          if (editable) {
            return (
              <DropDownSelect
                value={String(protocolId)}
                data={protocolsData}
                onChange={e => this.listProtoChange(e, 'protocolId', record.id || record.key)}
              />
            );
          }
          return text;
        },
      },
      {
        title: '注册时间',
        dataIndex: 'registerDate',
        key: 'registerDate',
        align: 'center',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm') : ''),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        width: '18%',
        render: (text, record) => {
          const { inviteDate, orgId } = record;
          if (orgId) {
            if (record.editable)
              return (
                <div>
                  <a onClick={e => this.saveRow(e, record.id)}>保存</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.cancleEditInvite(e, record.id)}>取消</a>
                </div>
              );
            return (
              <div>
                <a onClick={e => this.toggleEditable(e, record.id)}>修改</a>
              </div>
            );
          }

          let content = '当天已发送';
          if (inviteDate) {
            if (moment(inviteDate).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
              content = (
                <Button type="primary" onClick={() => this.invite(record)}>
                  再次发送
                </Button>
              );
            }
          }
          return <div className={styles.action}>{content}</div>;
        },
      },
    ];
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <div className={styles.inviteContainer}>
        <div className={styles.titleButtonCon}>
          <Button className={styles.titleButton} type="primary" onClick={this.showModal}>
            邀请
          </Button>
          <Button className={styles.titleButton} onClick={this.showMaterielModal}>
            物料码
          </Button>
        </div>
        {this.renderTabs()}
        <div className={styles.tabList}>
          <StandardTable
            rowKey={record => record.id}
            needRowSelection={false}
            loading={loading || changeLoading}
            data={data}
            pagination={pagination}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.pageChange}
            showTotal={() => `共 ${totalCount} 条数据`}
          />
        </div>
        <Modal
          title="发送邀请"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className={styles.inviteModal}
        >
          <Form layout="vertical" hideRequiredMark>
            <FormItem
              className={styles.createdesignFormTitle}
              {...formItemLayout}
              label="受邀人姓名"
            >
              {getFieldDecorator('invitePeople', {
                rules: [{ required: true, message: '请填写受邀人姓名' }],
              })(<Input placeholder="请填写受邀人姓名" />)}
            </FormItem>
            <FormItem
              className={styles.createdesignFormTitle}
              {...formItemLayout}
              label="受邀人号码"
            >
              {getFieldDecorator('inviteMobile', {
                rules: [
                  { required: true, message: '请填写受邀人号码' },
                  { validator: validatorPhone },
                ],
              })(<Input placeholder="请填写受邀人号码" />)}
            </FormItem>
            <FormItem className={styles.createdesignFormTitle} {...formItemLayout} label="企业协议">
              {getFieldDecorator('protocolId', {
                rules: [{ required: true, message: '请选择企业协议' }],
              })(<DropDownSelect data={protocolsData} onChange={this.protoChange} />)}
              <div className={styles.inviteRemark}>{protoRemark}</div>
            </FormItem>
          </Form>
        </Modal>
        <MaterielCodeModal
          protocolData={protocolsData}
          ref={ref => {
            this.materieCode = ref ? ref.wrappedInstance : null;
          }}
        />
      </div>
    );
  }
}

export default InvitedOrg;
