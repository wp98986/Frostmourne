import deepEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import { formatMessage } from 'umi/locale';

import siteRoutes from '@config/site.router';
import bossRoutes from '@config/boss.router';

export function route2Page(r, parentAuthority, parentName) {
  if (!r) return null;
  let newRoutes = r;

  // 过滤不需要权限的页面
  newRoutes = newRoutes.filter(
    ({ needAuth, redirect, name }) =>
      name && !redirect && needAuth !== false && (needAuth || parentAuthority)
  );

  return newRoutes
    .map(({ path, name, redirect, routes, needAuth = parentAuthority, btns, ...others }) => {
      if (!name || redirect || needAuth === false) {
        return null;
      }

      let value;
      if (parentName) {
        value = `${parentName}.${name}`;
      }

      let children;
      if (routes) {
        children = route2Page(routes, needAuth || parentAuthority, value);
      }
      const local = value.substr(value.indexOf('.') + 1);
      return {
        title: formatMessage({ id: local, defaultMessage: name }),
        name,
        path,
        value,
        key: value,
        children,
        btns,
        ...others,
      };
    })
    .filter(item => item);
}

const memoizeGetPages = memoizeOne(site => {
  if (!site) return [];
  return site === 'site' || site === 'frontsite'
    ? route2Page(siteRoutes[1].routes, true, 'site.menu')
    : route2Page(bossRoutes[1].routes, true, 'boss.menu');
}, deepEqual);

export function getPages(site) {
  return memoizeGetPages(site);
}
