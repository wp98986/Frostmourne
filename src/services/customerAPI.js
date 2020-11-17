import { get, post } from '@/utils/request';

export async function list(params, options = {}) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/customer/list', queryParam, options);
}

export async function select(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/customer/select', queryParam);
}

export async function fetchSrcList(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/customer/srctypelist', queryParam);
}

export async function find(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/customer/find', queryParam);
}

export async function custNow(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/customer/find', queryParam);
}

export async function checkCust(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/customer/update', formData);
}

export async function check(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/customer/check', queryParam);
}

export async function update(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/customer/update', formData);
}

export async function add(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/customer/add', formData);
}

export async function updatebyPad(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/customer/updatebyPad', formData);
}

export async function addbypad(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/customer/addbypad', formData);
}

export async function newCust(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/customer/addbypad', formData);
}

export async function updateCust(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/customer/updatebyPad', formData);
}

export async function custNo(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/customer/getcode', queryParam);
}

export async function del(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/customer/del', formData);
}

export async function fetchDesign(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/staff/designers', queryParam);
}

export async function fetchRecords(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/communicationrecord/list', queryParam);
}

export async function addRecord(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/communicationrecord/add', formData);
}

export async function updateRecord(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/communicationrecord/update', formData);
}

export async function delRecord(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/communicationrecord/del', formData);
}

export async function fetchPlans(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/design/querycustomer', queryParam);
}

export async function fetchBuildings(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/building/select', queryParam);
}

export async function querycustomerlist(param = {}, options = {}) {
  return get('/site/customer/select', { queryParam: JSON.stringify(param) }, options);
}

export async function fetchOrders(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/order/customerorderlist', queryParam);
}

export async function customercount(param = {}, options = {}) {
  return get('/site/customer/count', { queryParam: JSON.stringify(param) }, options);
}

export async function exportCustomer(params) {
  const target = '//site.pei.nature-home.cn';
  const url = `${target}/${APP_TYPE}/customer/listtoexcel?queryParam=${JSON.stringify(params)}`;
  window.open(encodeURI(url));
}
