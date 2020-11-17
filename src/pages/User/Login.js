import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
import { Alert, message } from 'antd';
import Login from '@/components/Login';
import BlockSlider from '@/components/BlockSlider';
import styles from './Login.less';

const { Tab, Password, Submit, UserName } = Login;
// const { Submit, UserName, Password } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    showVer: false,
    // autoLogin: true,
  };

  componentDidMount() {
    if (APP_TYPE === 'site') {
      const errorTimes = JSON.parse(localStorage.getItem('SITEerrorTimes')) || {};
      const { today, times } = errorTimes;
      const td = moment().format('YYYY-MM-DD');
      if (today !== td) {
        localStorage.removeItem('SITEerrorTimes');
      } else if (today === td) {
        if (times >= 3) {
          this.setState({ showVer: true });
        }
      }
    }
  }

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
            type: 'login/getCaptcha',
            payload: values.mobile,
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
    const { type, renderStr, showVer } = this.state;
    if (showVer) {
      if (!renderStr && APP_TYPE === 'site') {
        message.error('请先通过滑块验证');
        return;
      }
    }
    if (!err) {
      const { dispatch } = this.props;
      const that = this;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          renderStr,
        },
        callback: result => {
          const { data, errorMessage } = result;
          const msg = data ? data.message : errorMessage;
          if (data.code === '203') {
            message.success('登录成功');
            router.push('/');
          } else {
            if (APP_TYPE === 'site') {
              const errorTimes = JSON.parse(localStorage.getItem('SITEerrorTimes')) || {};
              const { times: t = 0 } = errorTimes;
              const td = moment().format('YYYY-MM-DD');
              const newTimes = parseInt(t, 10) + 1;
              if (newTimes === 3) {
                this.setState({ showVer: true });
                setTimeout(() => {});
              }
              localStorage.setItem(
                'SITEerrorTimes',
                JSON.stringify({ today: td, times: newTimes })
              );
              if (showVer) {
                that.ver.reset();
              }
            }
            message.error(`登录失败，${msg}`);
            if (that.ver) that.ver.reset();
          }
        },
      });
    }
  };

  fetchStr = () => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'user/verificateStr',
      payload: {},
      callback: result => {
        const { data, errorMessage } = result;
        if (data && data.length > 0) {
          that.setState({ renderStr: data });
        } else {
          message.error(errorMessage);
        }
      },
    });
  };

  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting, login } = this.props;
    const {
      type,
      showVer,
      // autoLogin
    } = this.state;
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
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName name="userName" />
            <Password
              name="userPwd"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            {APP_TYPE === 'site' && showVer ? (
              <div className={styles.vertificate}>
                <BlockSlider
                  getInstance={ref => {
                    this.ver = ref;
                  }}
                  successHandler={this.fetchStr}
                />
              </div>
            ) : null}
          </Tab>
          {
            // <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
            //   {login.status === 'error' &&
            //     login.type === 'mobile' &&
            //     !submitting &&
            //     this.renderMessage(
            //       formatMessage({ id: 'app.login.message-invalid-verification-code' })
            //     )}
            //   <Mobile name="userName" />
            //   <Captcha name="captcha" countDown={60} onGetCaptcha={this.onGetCaptcha} />
            // </Tab>
          }
          {
            // <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
            //   <FormattedMessage id="app.login.remember-me" />
            // </Checkbox>
          }
          {APP_TYPE === 'site' ? (
            <div>
              <div className={styles.extra}>
                <Link to="/user/modpwd" style={{ float: 'left' }}>
                  找回密码
                </Link>
                <Link to="/user/register" style={{ float: 'right' }}>
                  <FormattedMessage id="app.login.signup" />
                </Link>
                {
                  // <a href="">
                  //   <FormattedMessage id="app.login.forgot-password" />
                  //   &nbsp;&#124;&nbsp;
                  // </a>
                }
              </div>
            </div>
          ) : null}
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          {
            // <div className={styles.other}>
            //   <FormattedMessage id="app.login.sign-in-with" />
            //   <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            //   <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            //   <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            //   <Link className={styles.register} to="/user/register">
            //     <FormattedMessage id="app.login.signup" />
            //   </Link>
            // </div>
          }
        </Login>
      </div>
    );
  }
}

export default LoginPage;
