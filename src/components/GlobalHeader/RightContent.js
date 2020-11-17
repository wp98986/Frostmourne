import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';

import {
  BankOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  FlagOutlined,
  HomeOutlined,
  LogoutOutlined,
  MobileOutlined,
  SettingOutlined,
  SwapOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

// import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip } from 'antd';
import { Spin, Tag, Menu, Dropdown, Avatar, Button, Input, Modal } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import AreaSelect from '@/components/AreaSelect';
import { validatorPhone, validatorRealName } from '@/utils/formUtils';
// import lvIcon from '@/assets/icon_lv.png';
import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
// import SelectLang from '../SelectLang';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
class GlobalHeaderRight extends PureComponent {
  state = {
    addVisible: false,
    joinVisble: false,
    inviteCode: '',
  };

  getNoticeData() {
    const { notices: { list: notices = [] } = {} } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const noticesFilter = notices.filter(item => item.status === 'unRead');
    const newNoticesArr = noticesFilter.slice(0, 5);
    const newNotices = newNoticesArr.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.createdate) {
        newNotice.datetime = moment(notice.createdate).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      newNotice.read = false;
      if (newNotice.status === 'hasRead') {
        newNotice.read = true;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  tabChange = key => {
    const { noticeTabChange } = this.props;
    if (noticeTabChange) noticeTabChange(key);
  };

  clickAddOrg = () => {
    const { addVisible } = this.state;
    const { form } = this.props;
    this.setState({
      addVisible: !addVisible,
    });
    if (addVisible) {
      form.resetFields();
    }
  };

  clickJoinOrg = () => {
    const { joinVisble } = this.state;
    this.setState({
      joinVisble: !joinVisble,
    });
    if (joinVisble) {
      this.setState({
        inviteCode: '',
      });
    }
  };

  inviteCodeChange = e => {
    const value = e.target.value;
    if (value) {
      this.setState({
        inviteCode: value,
      });
    } else {
      this.setState({
        inviteCode: '',
      });
    }
  };

  saveOrg = e => {
    const { form, addOrg } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (typeof addOrg === 'function') {
          addOrg(values);
          this.setState({
            addVisible: false,
          });
        }
      }
    });
  };

  joinOrg = () => {
    const { joinOrg } = this.props;
    const { inviteCode } = this.state;
    if (typeof joinOrg === 'function') {
      joinOrg(inviteCode);
      this.setState({
        joinVisble: false,
        inviteCode: '',
      });
    }
  };

  cancelJoin = () => {
    this.setState({
      joinVisble: false,
      inviteCode: '',
    });
  };

  setNoticeRead = item => {
    const { setNoticeRead } = this.props;
    setNoticeRead(item.id);
  };

  render() {
    const {
      currentUser,
      changeList,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      onChangeOrg,
      theme,
      form: { getFieldDecorator },
      noticesCount,
    } = this.props;
    const { inviteCode, addVisible, joinVisble } = this.state;
    let orgs = get(changeList, 'data');
    if (!orgs) orgs = [];
    const userData = get(currentUser, 'data');
    const status = get(currentUser, 'data.org.status');
    // const orgType = get(currentUser, 'data.org.orgType');
    const deptName = get(userData, 'org.name');
    const deptId = get(userData, 'org.id');
    // const protocolName = get(userData, 'org.protocolName');
    // const {
    //   data: {
    //     org: {
    //       inviteStaff: { name: inviteStaffName, user: { mobile: inviteStaffMobile } = {} } = {},
    //     } = {},
    //   } = {},
    // } = currentUser;
    // console.log(currentUser);
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {APP_TYPE === 'site' && status === 'comfirm' ? (
          <Menu.Item key="orgInfo">
            <BankOutlined />
            <FormattedMessage id="menu.site.org.info" defaultMessage="account center" />
          </Menu.Item>
        ) : null}
        {APP_TYPE === 'site' && status === 'comfirm' ? (
          <Menu.Item key="userinfo">
            <SettingOutlined />
            <FormattedMessage id="menu.site.settings" defaultMessage="account settings" />
          </Menu.Item>
        ) : null}
        {
          // <Menu.Item key="triggerError">
          //   <Icon type="close-circle" />
          //   <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
          // </Menu.Item>
        }
        <Menu.Divider />
        {
          // <Menu.Item key="modpwd">
          //   <Icon type="edit" />
          //   <FormattedMessage id="menu.account.modpwd" defaultMessage="modpwd" />
          // </Menu.Item>
        }
        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    const orgMenuItems = orgs.map((item, index) => {
      const key = index;
      let checked = false;
      if (deptId === item.org.id) checked = true;
      return (
        <Menu.Item key={key} onClick={() => onChangeOrg(item.id)}>
          <FlagOutlined style={checked ? { color: 'orange' } : null} />
          <span>{item.org.name}</span>
        </Menu.Item>
      );
    });
    const orgMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {orgMenuItems}
        {
          // <Menu.Item key="joinOrg" onClick={this.clickAddOrg}>
          //   <Icon type="add" />
          //   <span>新增企业</span>
          // </Menu.Item>
          // <Menu.Item key="addOrg" onClick={this.clickJoinOrg}>
          //   <Icon type="add" />
          //   <span>加入企业</span>
          // </Menu.Item>
        }
      </Menu>
    );
    const noticeData = this.getNoticeData();
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    const cansee = true;
    return (
      <div className={styles.topBox} style={APP_TYPE === 'site' ? { flex: '' } : { flex: '' }}>
        <div className={className}>
          {/* {APP_TYPE === 'site' ? (
            <span rel="noopener noreferrer" className={styles.action}>
              <img src={lvIcon} style={{ width: 28, marginTop: -4 }} alt="" />
              <span style={{ padding: 4 }}>企业等级：{protocolName}</span>
            </span>
          ) : null} */}

          {/* {APP_TYPE === 'site' ? (
            <span rel="noopener noreferrer" className={styles.action}>
              <Icon type="phone" />
              <span style={{ padding: 4 }}>400-999-7273</span>
            </span>
          ) : null} */}

          {/* {APP_TYPE === 'site' ? (
            <span
              onClick={() => {
                window.open('//help.nature-home.cn');
              }}
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
              <span style={{ padding: 4 }}>帮助文档</span>
            </span>
          ) : null} */}
          {cansee ? (
            <NoticeIcon
              className={styles.action}
              count={noticesCount}
              onTabChange={this.tabChange}
              onItemClick={() => {
                // console.log(item, tabProps); // eslint-disable-line
              }}
              locale={{
                emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
                clear: formatMessage({ id: 'component.noticeIcon.clear' }),
                viewMore: formatMessage({ id: 'component.noticeIcon.view-more' }),
              }}
              onClear={onNoticeClear}
              onPopupVisibleChange={onNoticeVisibleChange}
              loading={fetchingNotices}
              popupAlign={{ offset: [20, -16] }}
              clearClose
              showViewMore
              onViewMore={() => router.push('/notification/mynotice/list')}
              setNoticeRead={this.setNoticeRead}
            >
              <NoticeIcon.Tab
                list={noticeData.orderMessage}
                title={formatMessage({ id: 'component.globalHeader.message' })}
                name="orderMessage"
                showViewMore
                // emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
                // emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
              />
              <NoticeIcon.Tab
                list={noticeData.notification}
                title={formatMessage({ id: 'component.globalHeader.notification' })}
                name="notification"
                showViewMore
                // emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
                // emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
              />
            </NoticeIcon>
          ) : null}

          {APP_TYPE === 'site' ? (
            <Dropdown overlay={orgMenu}>
              <span className={`${styles.action} ${styles.account}`}>
                <SwapOutlined style={{ verticalAlign: 'sub' }} />
                <span className={styles.name}>{deptName}</span>
              </span>
            </Dropdown>
          ) : null}
          {userData ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                {userData.user.headImg ? (
                  <Avatar
                    size="small"
                    className={styles.avatar}
                    src={userData.user.headImg}
                    alt="avatar"
                  />
                ) : (
                  <span className={styles.noAvatar}>
                    <UserOutlined />
                  </span>
                )}
                <span className={styles.name}>{userData.user.realName}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
          )}
          {
            // <SelectLang className={styles.action} />
          }
          <Modal title="创建企业" visible={addVisible} footer={[]} onCancel={this.clickAddOrg}>
            <Form>
              <FormItem>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入企业名称' }],
                })(
                  <Input
                    prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="填写企业名称"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('area', {
                  rules: [{ required: true, message: '请选择区域' }],
                })(
                  <AreaSelect
                    prefix={<CompassOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    style={{ width: '100%' }}
                    placeholder="选择区域"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('address', {
                  rules: [{ required: true, message: '请填写详细地址' }],
                })(
                  <Input
                    prefix={<EnvironmentOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请填写详细地址"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('contact', {
                  rules: [
                    { required: true, message: '请输入联系人' },
                    { validator: validatorRealName },
                  ],
                })(
                  <Input
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="填写联系人"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('mobile', {
                  rules: [
                    { required: true, message: '请输入联系人电话' },
                    { validator: validatorPhone },
                  ],
                })(
                  <Input
                    prefix={<MobileOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="填写联系人电话"
                  />
                )}
              </FormItem>
              <Button block type="primary" onClick={this.saveOrg} style={{ marginTop: 10 }}>
                创建
              </Button>
            </Form>
          </Modal>
          <Modal title="加入企业" visible={joinVisble} footer={[]} onCancel={this.cancelJoin}>
            <div>
              <Input placeholder="输入邀请码" value={inviteCode} onChange={this.inviteCodeChange} />
              <Button
                block
                type="primary"
                disabled={inviteCode.length === 0}
                onClick={this.joinOrg}
                style={{ marginTop: 10 }}
              >
                加入
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default GlobalHeaderRight;
