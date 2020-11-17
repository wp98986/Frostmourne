import { get, post, getWithPrefix } from '@/utils/request';

// BOSS端
export async function fetchList(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/boss/app/list', queryParam);
}

export async function fetchView(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/boss/app/find', queryParam);
}

export async function update(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/boss/app/update', formData);
}

export async function add(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/boss/app/add', formData);
}

export async function del(params) {
  const newParams = params || {};
  const updateParam = { updateParam: JSON.stringify(newParams) };
  return get('/boss/app/del', updateParam);
}

export async function functions(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/boss/app/functions', queryParam);
}

// SITE端
export async function purchase(params) {
  const newParams = params || {};
  const queryParam = { updateParam: JSON.stringify(newParams) };
  return getWithPrefix('/appauth/add', queryParam);
}

export async function appList(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/app/list', queryParam);
}
