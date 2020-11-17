import { get, post } from '@/utils/request';

// BOSS端
export async function list(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/boss/function/list', queryParam);
}

export async function authlist(params) {
  const { portType } = params || {};
  let url = portType === 'boss' ? '/boss/function/authlist' : '/boss/function/siteauthlist';
  if (portType === 'supplier') url = '/boss/function/supplierauthlist';
  return get(url);
}

export async function find(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/boss/function/find', queryParam);
}

export async function update(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/function/update', formData);
}

export async function add(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/function/add', formData);
}

export async function remove(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/function/del', formData);
}

// SITE端
export async function siteList(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/function/list', queryParam);
}
