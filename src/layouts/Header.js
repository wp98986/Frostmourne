import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message, notification } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
import Authorized from '@/utils/Authorized';

const { Header } = Layout;

// function delCookie(name) {
//   const date = new Date();
//   date.setTime(date.getTime() - 360000000);
//   const cval = name;
//   if (cval != null)
//     document.cookie = `${name}=${cval};path=${window.location.host};expires=${date.toGMTString()}`;
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

class HeaderView extends PureComponent {
  state = {
    visible: true,
    currentUser: {},
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    if (props.currentUser.data && state.currentUser) {
      return {
        currentUser: props.currentUser.data,
      };
    }
    return null;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { currentUser } = this.state;
    document.addEventListener('scroll', this.handScroll, { passive: true });
    const data = get(currentUser, 'data');
    const staffId = get(data, 'user.id');
    if (APP_TYPE === 'site') {
      dispatch({
        type: 'user/fetchChangeList',
        payload: { staffId },
      });
    }
    dispatch({
      type: 'global/noticesCount',
      payload: { status: 'unRead' },
    });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
    this.setNoticeRead(undefined, type);
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'global/clearNotices',
    //   payload: type,
    // });
  };

  onChangeOrg = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/change',
      payload: { id },
      callback: result => {
        const { data } = result;
        if (data.code === '203') {
          message.success('切换成功');
          dispatch({
            type: 'user/fetchCurrent',
          });
          dispatch({
            type: 'global/noticesCount',
            payload: { status: 'unRead' },
          });
          router.push('/');
        } else {
          message.error(`切换失败，${data.message}`);
        }
      },
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'orgInfo') {
      router.push('/basic/org/department');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
      router.push('/basic/settings/personal');
      return;
    }
    if (key === 'modpwd') {
      router.push('/user/modpwd');
      return;
    }
    if (key === 'logout') {
      // delCookie(`${APP_TYPE}Token`);
      clearAllCookie();
      setTimeout(() => {
        dispatch({
          type: 'login/logout',
        });
      }, 200);
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
        payload: { page: 1, status: 'unRead' },
      });
    }
  };

  // noticeTabChange = key => {
  //   const { dispatch } = this.props;
  //   if (key.indexOf('notification') !== -1) {
  //     dispatch({
  //       type: 'global/fetchNotices',
  //       payload: { page: 1, type: 'notification', status: "unRead" },
  //     });
  //   } else {
  //     dispatch({
  //       type: 'global/fetchNotices',
  //       payload: { page: 1, type: 'orderMessage', status: "unRead" },
  //     });
  //   }
  // };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        }
        if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        }
        if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  joinOrg = inviteCode => {
    const { dispatch } = this.props;
    const { currentUser } = this.state;
    const id = get(currentUser, 'id');
    const userId = get(currentUser, 'user.id');
    dispatch({
      type: 'user/joinOrg',
      payload: { id, userId, inviteCode },
      callback: result => {
        const { data: res } = result;
        if (res.code === '203') {
          message.success('加入成功');
          if (APP_TYPE === 'site') {
            dispatch({
              type: 'user/fetchChangeList',
              payload: { staffId: userId },
            });
          }
        } else {
          message.error(`加入失败，${res.message}`);
        }
      },
    });
  };

  addOrg = values => {
    const { dispatch, currentUser } = this.props;
    const id = get(currentUser, 'id');
    const userId = get(currentUser, 'user.id');
    const area = get(values, 'area');
    const province = area[0];
    const city = area[1];
    const district = area[2];
    dispatch({
      type: 'user/addOrg',
      payload: { ...values, id, userId, province, city, district },
      callback: result => {
        const { data: res } = result;
        if (res.code === '203') {
          message.success('创建成功');
        } else {
          message.error(`创建失败，${res.message}`);
        }
      },
    });
  };

  setNoticeRead = (id, type) => {
    // const { id } = item;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/setNoticesRead',
      payload: { id, type },
      callback: res => {
        const {
          data: { code, message: returnMessage },
        } = res;
        if (code === '203') {
          //
          dispatch({
            type: 'global/fetchNotices',
            payload: { page: 1 },
          });
          dispatch({
            type: 'global/noticesCount',
            payload: { status: 'unRead' },
          });
        } else {
          notification.error({
            message: '失败',
            description: returnMessage,
          });
        }
      },
    });
  };

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            contentWidth="Fixed"
            theme={navTheme}
            mode="horizontal"
            Authorized={Authorized}
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            addOrg={this.addOrg}
            joinOrg={this.joinOrg}
            noticeTabChange={this.noticeTabChange}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            onChangeOrg={this.onChangeOrg}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            addOrg={this.addOrg}
            joinOrg={this.joinOrg}
            noticeTabChange={this.noticeTabChange}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            onChangeOrg={this.onChangeOrg}
            setNoticeRead={this.setNoticeRead}
            {...this.props}
          />
        )}
      </Header>
    ) : null;
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default connect(({ user, global, setting, loading }) => ({
  currentUser: user.currentUser,
  changeList: user.changeList,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  noticesCount: global.noticesCount,
  setting,
}))(HeaderView);
