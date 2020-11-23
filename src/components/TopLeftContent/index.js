import React, { Component } from 'react';
import { Dropdown, Menu, Modal, Input, Button } from 'antd';
// import SlideVerification from '@/components/SlideVerification';
import BlockSlider from '@/components/BlockSlider';
import { history, connect } from 'umi';
import moment from 'moment';

import styles from './index.less';

// function delCookie(name) {
//   const date = new Date();
//   date.setTime(date.getTime() - 360000000);
//   const cval = name;
//   document.cookie = `${name}=${cval};path=${window.location.host};expires=${date.toGMTString()}`;
// }

function clearAllCookie() {
  const date = new Date();
  date.setTime(date.getTime() - 10000);
  const keys = document.cookie.match(/[^ =;]+(?=)/g);
  if (keys) {
    for (let i = keys.length; i--; )
      document.cookie = `${keys[i]}=0; expire=${date.toGMTString()}; path=/`;
  }
}

class TopLeftContent extends Component {
  state = {
    loginVisible: false,
    pwd: undefined,
    showVer: false,
  };

  componentDidMount() {
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

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'info') {
      history.push('/');
      return;
    }
    if (key === 'modpwd') {
      history.push('/user/modpwd');
      return;
    }
    if (key === 'logout') {
      // delCookie('siteToken');
      clearAllCookie();
      localStorage.removeItem('customer');
      setTimeout(() => {
        // dispatch({
        //   type: 'designmodels/updateProNum',
        //   paylpad: 0,
        // });
        dispatch({
          type: 'login/logout',
        });
      }, 200);
    }
  };

  openLogin = () => {
    this.setState({ loginVisible: true });
    setTimeout(() => {
      // console.log(this);
      this.ver.reset();
    }, 100);
  };

  closeLogin = () => {
    this.setState({ loginVisible: false, pwd: undefined });
  };

  inputChange = e => {
    const value = e.target.value;
    this.setState({ pwd: value });
  };

  fetchStr = () => {
    const { dispatch } = this.props;
    this.setState({ errorMessage: undefined });
    const that = this;
    dispatch({
      type: 'user/verificateStr',
      payload: {},
      callback: result => {
        const { data, errorMessage } = result;
        if (data && data.length > 0) {
          that.setState({ renderStr: data });
        } else {
          that.setState({ errorMessage });
        }
      },
    });
  };

  login = () => {
    const { renderStr, pwd, showVer } = this.state;
    const {
      currentUser: { data: { user: { mobile: userName } = {} } = {} } = {},
      dispatch,
    } = this.props;
    if (!pwd) {
      this.setState({ errorMessage: '请输入密码' });
      return;
    }
    if (showVer) {
      if (!renderStr) {
        this.setState({ errorMessage: '请先通过滑块验证' });
        return;
      }
    }
    const that = this;
    const newWindow = window.open('', '_blank');
    dispatch({
      type: 'login/login',
      payload: {
        userName,
        userPwd: pwd,
        renderStr,
      },
      callback: result => {
        const { data, errorMessage } = result;
        const msg = data ? data.message : errorMessage;
        if (data.code === '203') {
          that.closeLogin();
          newWindow.location = 'http://site.pei.nature-home.cn';
        } else {
          const errorTimes = JSON.parse(localStorage.getItem('SITEerrorTimes')) || {};
          const { times: t = 0 } = errorTimes;
          const td = moment().format('YYYY-MM-DD');
          const newTimes = parseInt(t, 10) + 1;
          if (newTimes === 3) {
            this.setState({ showVer: true });
            setTimeout(() => {});
          }
          localStorage.setItem('SITEerrorTimes', JSON.stringify({ today: td, times: newTimes }));
          if (showVer) {
            that.ver.reset();
          }
          that.setState({ errorMessage: msg });
        }
      },
    });
  };

  render() {
    const { currentUser } = this.props;
    const { loginVisible, pwd, errorMessage, showVer } = this.state;
    const name = get(currentUser, 'data.name');
    const designerMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
        {
          // <Menu.Item key="info">
          //   <span>个人设置</span>
          // </Menu.Item>
          // <Menu.Item key="modpwd">
          //   <span>修改密码</span>
          // </Menu.Item>
        }
        <Menu.Item key="logout">
          <span>退出登录</span>
        </Menu.Item>
      </Menu>
    );
    const btnActive = pwd || false;
    // const that = this;

    // 判断mime
    // const mime = (option, value) => {
    //   // debugger;
    //   const mimeTypes = navigator.mimeTypes || [];
    //   for (let i = 0; i < mimeTypes.length; i++) {
    //     if (mimeTypes[i][option] === value) {
    //       return true;
    //     }
    //   }
    //   return false;
    // };
    // const is360js = mime('type', 'application/vnd.chromium.remoting-viewer');
    return (
      <div className={styles.container}>
        <Dropdown overlay={designerMenu}>
          <span className={`${styles.action} ${styles.account}`}>
            <span className={styles.name}>{name}</span>
          </span>
        </Dropdown>
        <a
          // href="http://site.pei.nature-home.cn"
          // target="_blank"
          // rel="noopener noreferrer"
          onClick={this.openLogin}
          style={{ marginLeft: 30 }}
        >
          登录商家后端
        </a>
        <Modal
          maskClosable={false}
          title="输入密码"
          visible={loginVisible}
          footer={null}
          onCancel={this.closeLogin}
          className={styles.loginModal}
        >
          {
            //   is360js ? (
            //   <div style={{ fontSize: '12px', color: '#cf0000', marginBottom: 10 }}>
            //     注意事项：部分360浏览器会拦截网页，请设置：选项/设置》高级设置》不允许任何网站显示弹出式窗口
            //     去掉勾选{' '}
            //   </div>
            // ) : null
          }
          <Input.Password
            autoComplete="new-password"
            value={pwd}
            onChange={this.inputChange}
            onPressEnter={this.login}
            placeholder="请输入正确的登录密码"
          />

          <a
            href="http://site.pei.nature-home.cn/user/modpwd"
            target="_blank"
            rel="noopener noreferrer"
          >
            忘记密码？
          </a>
          {errorMessage ? <span className={styles.errorMessage}>{errorMessage}</span> : null}
          {showVer ? (
            <BlockSlider
              getInstance={ref => {
                this.ver = ref;
              }}
              successHandler={this.fetchStr}
            />
          ) : null}
          <div className={styles.loginBtn}>
            <Button
              onClick={this.login}
              className={pwd ? styles.btnActive : null}
              disabled={!btnActive}
              type="primary"
            >
              确定
            </Button>
            <Button style={{ marginLeft: 20 }} onClick={this.closeLogin}>
              取消
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(({ user, login }) => ({
  user,
  login,
  currentUser: user.currentUser,
}))(TopLeftContent);
