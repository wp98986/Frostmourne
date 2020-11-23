import React, { Component, Fragment } from 'react';
import { connect, history, formatMessage, FormattedMessage } from 'umi';

import Login from '@/components/Login';
import { List, message, Modal } from 'antd';
// import { getTimeDistance } from '@/utils/utils';

const { Password, Submit } = Login;

function delCookie(name) {
  const date = new Date();
  date.setTime(date.getTime() - 1);
  const cval = name;
  if (cval != null) document.cookie = `${name}=${cval};expires=${date.toGMTString()}`;
}

const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
    </font>
  ),
};

@connect(({ user, loading }) => ({
  user,
  currentUser: user.currentUser,
  submitting: loading.effects['login/modpass'],
}))
class SecurityView extends Component {
  state = {
    editModalVisible: false,
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/modpass',
        payload: {
          ...values,
          type,
        },
        callback: result => {
          const { data, errorMessage } = result;
          const msg = data ? data.message : errorMessage;
          if (data.code === '203') {
            message.success('修改成功');
            delCookie(`${APP_TYPE}Token`);
            dispatch({
              type: 'login/logout',
            });
            history.push('/user');
          } else {
            message.error(`修改失败，${msg}`);
          }
        },
      });
    }
  };

  handleEditModalVisible = () => {
    const { editModalVisible } = this.state;
    this.setState({
      editModalVisible: !editModalVisible,
    });
  };

  getData = () => {
    const { currentUser } = this.props;
    const mobile = get(currentUser, 'data.user.mobile');
    return [
      {
        title: formatMessage({ id: 'app.settings.security.password' }, {}),
        description: (
          <Fragment>
            {formatMessage({ id: 'app.settings.security.password-description' })}：
            {passwordStrength.weak}
          </Fragment>
        ),
        actions: [
          <a onClick={this.handleEditModalVisible}>
            <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
          </a>,
        ],
      },
      {
        title: formatMessage({ id: 'app.settings.security.phone' }, {}),
        description: `${formatMessage(
          { id: 'app.settings.security.phone-description' },
          {}
        )}：${mobile}`,
        // actions: [
        //   <a>
        //     <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        //   </a>,
        // ],
      },
    ];
  };

  render() {
    const { submitting } = this.props;
    const { editModalVisible } = this.state;
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <Modal
          title="修改密码"
          visible={editModalVisible}
          footer=""
          onCancel={this.handleEditModalVisible}
        >
          <Login
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            {
              // <UserName name="userName" />
            }
            <Password
              name="oldPassword"
              placeholder="输入您的旧密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            <Password
              name="newPassword"
              placeholder="输入您的新密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            <Submit loading={submitting}>提交</Submit>
          </Login>
        </Modal>
      </Fragment>
    );
  }
}

export default SecurityView;
