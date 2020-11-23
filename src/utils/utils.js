/* eslint-disable */
import moment from 'moment';
import React from 'react';
import { history } from 'umi';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export function stringJoin(joinStr, ...args) {
  let result = '';
  let hasFirst = false;
  for (let i = 0; i < args.length; i++) {
    const tmp = args[i];
    if (tmp) {
      const tmpJoinStr = hasFirst ? joinStr : '';
      result += tmpJoinStr + tmp;
      hasFirst = true;
    }
  }
  return result;
}

export function getAddress(addressModel) {
  if (!addressModel) {
    return { area: '', address: '' };
  }
  const { area1, area2, area3, cityS1, cityS2, cityS3, infoAddr } = addressModel;
  let { address } = addressModel;
  let area = '';
  if (area1) {
    area += area1;
  } else if (cityS1) {
    area += cityS1;
  }
  if (area2) {
    area += area2;
  } else if (cityS2) {
    area += cityS2;
  }
  if (area3) {
    area += area3;
  } else if (cityS3) {
    area += cityS3;
  }
  if (!address) {
    address = '';
  }
  if (infoAddr) {
    address = infoAddr;
  }
  return { area, address };
}

function areaList(areaModel, fields) {
  const result = [];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (areaModel[field]) {
      result.push(areaModel[field]);
    } else {
      result.push('');
    }
  }
  return result;
}

export function getAreaArray(areaModel) {
  if (!areaModel) {
    return [];
  }
  const { area1 } = areaModel;
  const { cityS1 } = areaModel;
  const { province } = areaModel;
  if (area1) {
    return areaList(areaModel, ['area1', 'area2', 'area3']);
  }
  if (cityS1) {
    return areaList(areaModel, ['cityS1', 'cityS2', 'cityS3']);
  }
  if (province) {
    return areaList(areaModel, ['province', 'city', 'district']);
  }
  return [];
}

export function getArea(areaValue, props) {
  if (!areaValue || !areaValue.trim || areaValue.trim() === '') {
    return null;
  }
  const areas = areaValue.split(' ');
  const result = {};
  for (let i = 0; i < areas.length; i++) {
    result[props[i]] = areas[i];
  }
  return result;
}

export function parseDate(dateStr, dateFormate) {
  if (!dateStr || !(typeof dateStr === 'string')) {
    return;
  }
  if (!dateFormate) {
    return new Date(dateStr);
  } else {
    const yearStart = dateFormate.indexOf('yyyy');
    const monthStart = dateFormate.indexOf('MM');
    const dayStart = dateFormate.indexOf('dd');
    const hourStart = dateFormate.indexOf('hh');
    const minuteStart = dateFormate.indexOf('mm');
    const secondStart = dateFormate.indexOf('ss');
    const year = yearStart < 0 ? '0000' : dateStr.substr(yearStart, 4);
    const month = monthStart < 0 ? '00' : dateStr.substr(monthStart, 2);
    const day = dayStart < 0 ? '00' : dateStr.substr(dayStart, 2);
    const hour = hourStart < 0 ? '00' : dateStr.substr(hourStart, 2);
    const minute = minuteStart < 0 ? '00' : dateStr.substr(minuteStart, 2);
    const second = secondStart < 0 ? '00' : dateStr.substr(secondStart, 2);
    const newDateStr = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return new Date(newDateStr);
  }
}

const DEFAULT_SERVER_FORMATE = 'yyyy年MM月dd日 hh:mm:ss';
const DEFAULT_TIME_FORMATE = 'yyyy-MM-dd hh:mm:ss';
const DEFAULT_DATE_FORMATE = 'yyyy-MM-dd';

export function formateDate(dateStr, originDateFormate, newDateFormate) {
  if (!dateStr || !(typeof dateStr === 'string')) {
    return null;
  }
  if (!originDateFormate) {
    originDateFormate = DEFAULT_SERVER_FORMATE;
  }
  if (!newDateFormate) {
    newDateFormate = DEFAULT_TIME_FORMATE;
  }
  const date = parseDate(dateStr, originDateFormate);
  if (date === 'Invalid Date') {
    return null;
  }
  return moment(date).format(newDateFormate);
}

export function checkMobil(mobile) {
  if (!mobile) {
    return false;
  }
  let telReg = mobile.length == 11; //跟不上时代的节奏，取消规则校验，只校验长度
  // let telReg = mobile.match(/^(0|86|17951)?(13[0-9]|15[0-9]|17[0135678]|18[0-9]|14[57])[0-9]{8}$/);
  return !!telReg;
}

export function pinyinSort(array, key) {
  const resultArray = array.sort(function compareFunction(param1, param2) {
    if (!param1[key]) {
      return;
    }
    return param1[key].localeCompare(param2[key], 'zh');
  });
  return resultArray;
}

export function getAddressStr(areaModel, args) {
  if (!areaModel) {
    return '';
  }
  args = Object.assign({ begin: 0, end: 3, joinStr: ' ' }, args);
  let { begin, end, joinStr } = args;
  let areaArray = getAreaArray(areaModel);
  let { address } = areaModel;
  areaArray.push(address);
  return areaArray.slice(begin, end).join(joinStr);
}

export function getListSorter(sorter) {
  const arr = [];
  if (JSON.stringify(sorter) !== '{}') {
    let sortType = '';
    if (sorter.order === 'descend') {
      sortType = 'desc';
    } else if (sorter.order === 'ascend') {
      sortType = 'asc';
    }
    const sorterItem = {
      field: sorter.field,
      sortType,
    };
    arr.push(sorterItem);
  }
  return arr;
}

export function getPhotoValue(picUrls) {
  const pic = picUrls || [];
  let newFileList = [];
  pic.map(file => {
    if (file.response) {
      newFileList.push(file.response.data);
    } else {
      newFileList.push(file.origUrl);
    }
    return file;
  });
  return newFileList;
}

export function goBack(path) {
  const { history: { state } = {} } = window;
  const { key } = state || {};
  if (key) {
    router.goBack();
  } else {
    history.push(path);
  }
}

export function isRootOrg(org = {}) {
  const { orgId: currentOrgId, rootOrg: { id: rootId } = {} } = org;
  return currentOrgId === rootId;
}
