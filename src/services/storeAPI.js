import { post, getWithPrefix } from '@/utils/request';

// BOSS端
export async function list(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/store/list', queryParam);
}

export async function selectStores(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/store/select', queryParam);
}

export async function selectManageStores(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/store/managestores', queryParam);
}

export async function find(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/store/find', queryParam);
}

export async function update(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/store/update', formData);
}

export async function add(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/store/add', formData);
}

export async function del(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/store/del', formData);
}
