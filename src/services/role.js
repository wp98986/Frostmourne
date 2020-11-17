import { post, get, getWithPrefix, postWithPrefix } from '@/utils/request';

// BOSS端
export async function fetchList(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/boss/role/originallist', queryParam);
}

export async function fetchView(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/role/find', queryParam);
}

export async function fecthFunctions(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/boss/function/select', queryParam);
}

export async function siteFunctions(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/function/select', queryParam);
}

export async function update(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/boss/role/originalupdate', formData);
}

export async function add(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/boss/role/originaladd', formData);
}

export async function del(params) {
  const newParams = params || {};
  const updateParam = { updateParam: JSON.stringify(newParams) };
  return get('/boss/role/del', updateParam);
}

export async function fecthApps(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/app/list', queryParam);
}

// SITE端
export async function roleList(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/role/list', queryParam);
}

export async function deleteRole(params) {
  const newParams = params || {};
  const updateParam = { updateParam: JSON.stringify(newParams) };
  return getWithPrefix('/role/del', updateParam);
}

export async function addRole(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/role/add', formData);
}

export async function updateRole(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/role/update', formData);
}

export async function saveFunctions(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/role/update', formData);
}
