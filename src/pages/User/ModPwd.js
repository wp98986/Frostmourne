import React, { Component } from 'react';
import { connect } from 'dva';
// import { formatMessage, FormattedMessage } from 'umi/locale';
// import Link from 'umi/link';
import router from 'umi/router';
import { Alert, message } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Password, Submit, Captcha, ContactNumber } = Login;
// const { Submit, UserName, Password } = Login;

function delCookie(name) {
  const date = new Date();
  date.setTime(date.getTime() - 1);
  const cval = name;
  if (cval != null) document.cookie = `${name}=${cval};expires=${date.toGMTString()}`;
}

@connect(({ login, user, loading }) => ({
  user,
  login,
  submitting: loading.effects['user/modpass'],
}))
class ModPwd extends Component {
  state = {
    type: 'account',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'user/getCaptcha',
            payload: { mobile: values.mobile },
            callback: result => {
              const { data } = result;
              if (data.code === '203') {
                message.success('短信验证码已发送到手机');
              } else {
                message.error(`发送失败，${data.message}`);
              }
            },
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/setPwd',
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
            router.push('/user');
          } else {
            message.error(`修改失败，${msg}`);
          }
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <ContactNumber name="mobile" placeholder="输入11位有效手机号码" />
          <Captcha
            autoComplete="off"
            name="checkCode"
            placeholder="输入您收到的验证码"
            countDown={60}
            onGetCaptcha={this.onGetCaptcha}
          />
          <Password
            autocomplete="new-password"
            name="newPassword"
            placeholder="输入您的新密码"
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <Submit loading={submitting}>提交</Submit>
        </Login>
      </div>
    );
  }
}

export default ModPwd;
