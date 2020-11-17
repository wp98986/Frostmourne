import React, { Fragment } from 'react';
// import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { CopyrightOutlined } from '@ant-design/icons';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
// import BgAnimation from '@/components/BgAnimation';
import styles from './UserLayout.less';
// import logo from '../assets/logo.svg';

// const links = [
//   {
//     key: 'help',
//     title: formatMessage({ id: 'layout.user.link.help' }),
//     href: '',
//   },
//   {
//     key: 'privacy',
//     title: formatMessage({ id: 'layout.user.link.privacy' }),
//     href: '',
//   },
//   {
//     key: 'terms',
//     title: formatMessage({ id: 'layout.user.link.terms' }),
//     href: '',
//   },
// ];

const copyright = (
  <Fragment>
    Copyright <CopyrightOutlined /> 2018 自然优品科技（横琴）有限公司 大数据中心技术部支持
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    let title = '商家端-优品配';
    if (APP_TYPE === 'boss') title = '平台端-优品配';
    if (APP_TYPE === 'supplier') title = '供应商端-优品配';
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src="/favicon.png" />
                <span className={styles.title}>{title}</span>
              </Link>
            </div>
            <div className={styles.desc}>实现让软装像买衣服一样简单</div>
          </div>
          {children}
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
