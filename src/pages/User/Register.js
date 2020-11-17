import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
// import Link from 'umi/link';
import router from 'umi/router';
import { Alert, message, Modal } from 'antd';
import Login from '@/components/Login';
import styles from './Register.less';

const {
  Tab,
  Submit,
  // Mobile,
  Captcha,
  // OrgType,
  Org,
  Linkman,
  Area,
  Address,
  // Realname,
  ContactNumber,
  InviteCode,
} = Login;

@connect(({ regist, loading }) => ({
  regist,
  submitting: loading.effects['regist/register'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
  };

  componentDidMount() {}

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
            type: 'regist/getCaptcha',
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
    const { type } = this.state;
    const { dispatch } = this.props;
    if (!err) {
      // const userName = get(values, 'mobile');
      if (type === 'account') {
        const newValues = values;
        const area = get(newValues, 'area');
        newValues.province = area[0];
        newValues.city = area[1];
        newValues.district = area[2];
        dispatch({
          type: 'regist/register',
          payload: {
            ...newValues,
          },
          callback: result => {
            const { data } = result;
            if (data.code === '203') {
              Modal.success({
                title: '注册成功',
                content: data.message,
              });
              router.push('/');
            } else {
              let msg = '';
              if (data.message) msg += `，${data.message}`;
              message.error(`注册失败${msg}`);
            }
          },
        });
      } else if (type === 'inviteCode') {
        dispatch({
          type: 'regist/joinorg',
          payload: {
            ...values,
          },
          callback: result => {
            const { data } = result;
            if (data.code === '203') {
              Modal.success({
                title: '注册成功',
                content: data.message,
              });
              router.push('/');
            } else {
              let msg = '';
              if (data.message) msg += `，${data.message}`;
              message.error(`注册失败${msg}`);
            }
          },
        });
      }
    }
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

  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

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
          <Tab key="account" tab="创建企业">
            {/* <OrgType name="orgType" /> */}
            <Org name="name" />
            <Area name="area" />
            <Address name="address" />
            <Linkman name="contact" />
            <ContactNumber name="mobile" />
            <div className={styles.forgetPwdCaptcha}>
              <Captcha name="checkCode" countDown={60} onGetCaptcha={this.onGetCaptcha} />
            </div>
            <InviteCode name="srcInviteCode" placeholder="企业邀请码" />
            {
              // <Realname name="realName" />
              // <Mobile name="mobile" />
              // <Captcha name="qrcode" countDown={60} onGetCaptcha={this.onGetCaptcha} />
            }
          </Tab>
          {
            // <Tab key="inviteCode" tab="加入企业">
            //   <InviteCode name="srcInviteCode" placeholder="个人邀请码" />
            //   <Realname name="realName" />
            //   <ContactNumber name="mobile" />
            //   {
            //     // <Captcha name="qrcode" countDown={60} onGetCaptcha={this.onGetCaptcha} />
            //   }
            // </Tab>
          }
          <div className={styles.extra}>
            <a href="/user/login">
              <FormattedMessage id="app.login.hadaccount" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.register.register" />
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
