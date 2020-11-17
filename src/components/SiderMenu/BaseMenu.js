import React, { PureComponent } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { Menu } from 'antd';
import Link from 'umi/link';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import styles from './index.less';

const { SubMenu } = Menu;

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1992315_u94sttc770j.js',
});

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <IconFont className={styles.aliIcon} type={icon} />;
  }
  return icon;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.getSelectedMenuKeys = memoizeOne(this.getSelectedMenuKeys, isEqual);
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, parent);
        if (CODE_EV === 'develop' || APP_TYPE === 'supplier') return ItemDom;
        return this.checkPermission(ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname =>
    urlToList(pathname).map(itemPath => getMenuMatches(this.flatMenuKeys, itemPath).pop());

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          className={styles.meunItemDeer}
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  // permission to check
  checkPermissionItem = ItemDom => {
    // const { Authorized } = this.props;
    // if (Authorized && Authorized.check) {
    //   const { check } = Authorized;
    //   return check(authority, ItemDom);
    // }
    // return ItemDom;
    const { currentUser, flatMenuKeys } = this.props;
    // console.log(flatMenuKeys)
    let pages = get(currentUser, 'data.pages');
    if (!pages) pages = [];
    let matchKeys = [];
    pages.map(item => {
      let key = '';
      for (let i = item.page.length; i > 0; i--) {
        if (item.page.charAt(i) === '.') {
          break;
        }
        key += item.page.charAt(i);
      }
      const newKey = key
        .split('')
        .reverse()
        .join('');
      // console.log(newKey)
      const arr = flatMenuKeys.filter(i => i.indexOf(newKey) >= 0);
      matchKeys = matchKeys.concat(arr);
      return item;
    });
    let isInMenu = false;
    matchKeys.map(item => {
      if (item.indexOf(ItemDom.key) >= 0) {
        isInMenu = true;
      }
      return item;
    });
    return isInMenu ? ItemDom : null;
  };

  checkPermission = ItemDom => {
    const {
      currentUser: { data = {} },
      route: { routes = [] },
    } = this.props;
    // console.log(routes)
    const { pages = [] } = data;
    let isInMenu = false;
    const rArr = [];
    function mapArr(arr, parentName) {
      const pn = parentName;
      arr.map(({ name, routes: rs, path }) => {
        if (!name) {
          return null;
        }
        // console.log(parentName)
        let value;
        if (pn) {
          value = `${pn}.${name}`;
        }

        let children;
        if (rs) {
          children = mapArr(rs, value);
        }

        // const local = value.substr(value.indexOf('.') + 1);
        rArr.push({
          name,
          value,
          path,
          // title: local
        });
        return { children };
      });
    }
    mapArr(routes, `${APP_TYPE}.menu`);
    const matchKeys = [];
    pages.map(p => {
      // matchKeys = rArr.filter(r => p.page.indexOf(r.name) === 0 && r.path);
      // let isExist = false;
      rArr.map(r => {
        if (p.page === r.value) matchKeys.push(r);
        return r;
      });
      return p;
    });
    matchKeys.map(k => {
      if (k.path.indexOf(ItemDom.key) === 0) isInMenu = true;
      return k;
    });
    return isInMenu ? ItemDom : null;
    // return ItemDom;
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={mode === 'horizontal' ? 'top-nav-menu' : ''}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
