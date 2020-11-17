import { getPages } from './pageHelper';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

function searchPage(path, pages) {
  if (!path) {
    return null;
  }
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.path === path) {
      return page;
    }
    if (page.children && page.children.length > 0) {
      const target = searchPage(path, page.children);
      if (target) return target;
    }
  }
  return null;
}

function getAllRoute(currentPage, routesArr = []) {
  const { value, children } = currentPage;
  routesArr.push(value);
  if (children) {
    children.forEach(item => {
      getAllRoute(item, routesArr);
    });
  }
  return routesArr;
}

export function getPage(ownPages = {}, currentRoute = {}) {
  const { path } = currentRoute;
  const allPages = getPages(APP_TYPE);
  const currentPage = searchPage(path, allPages) || {};
  const { needCtrlChidrenBtn } = currentPage;
  if (needCtrlChidrenBtn) {
    // 需要在外面控制子页面的按钮权限
    const pageValueArr = getAllRoute(currentPage);
    const ownPage = ownPages.filter(page => pageValueArr.indexOf(page.page) > -1) || [];
    return ownPage;
  }
  const ownPage = ownPages.filter(page => page.page === currentPage.value) || [];
  return ownPage;
}

export function getBtns(ownPages = {}, currentRoute = {}) {
  const ownPage = getPage(ownPages, currentRoute);
  let buttonArr = [];
  for (let i = 0; i < ownPage.length; i++) {
    const { buttons = [] } = ownPage[i];
    buttonArr = buttonArr.concat(buttons);
  }
  if (ownPage.length === 0) {
    return [];
  }
  return buttonArr;
}
