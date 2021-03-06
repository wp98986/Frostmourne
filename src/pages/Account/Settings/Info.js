import React, { Component } from 'react';
import { connect, history, FormattedMessage } from 'umi';

import { Menu } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getPage } from '@/utils/authority';
import styles from './Info.less';

const { Item } = Menu;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class Info extends Component {
  constructor(props) {
    super(props);
    const {
      match,
      location,
      // currentUser: { data: { userdata: { pages = [] } = {} } = {} } = {},
    } = props;

    const menuMap = {
      personal: (
        <FormattedMessage id="app.settings.menuMap.personal" defaultMessage="Personal Settings" />
      ),
      security: (
        <FormattedMessage id="app.settings.menuMap.security" defaultMessage="Security Settings" />
      ),
    };

    const key = location.pathname.replace(`${match.path}/`, '');
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: menuMap[key] ? key : 'base',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { match, location, currentUser: { data: { pages = [] } = {} } = {} } = props;
    const { menuMap } = state;
    const pagesArr = getPage(pages, { path: '/basic/settings/invitedorg' });
    if (pagesArr.length > 0) {
      menuMap.invitedorg = '受邀企业';
    }
    let selectKey = location.pathname.replace(`${match.path}/`, '');
    selectKey = state.menuMap[selectKey] ? selectKey : 'base';
    if (selectKey !== state.selectKey) {
      return { selectKey, menuMap };
    }
    return null;
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getmenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = ({ key }) => {
    history.push(`/basic/settings/${key}`);
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      let mode = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  render() {
    const { children } = this.props;
    // if (!currentUser.userid) {
    //   return '';
    // }
    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            this.main = ref;
          }}
        >
          <div className={styles.leftmenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={this.selectKey}>
              {this.getmenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {children}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default Info;
