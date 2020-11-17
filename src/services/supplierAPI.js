import { get, post } from '@/utils/request';

export async function list(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return get('/boss/org/list', queryParam);
}

export async function add(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/org/add', formData);
}

export async function update(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/org/update', formData);
}

export async function del(params = {}) {
  const updateParam = { updateParam: JSON.stringify(params) };
  return get('/boss/org/del', updateParam);
}

export async function sync(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return get('/boss/org/renovateyporg', queryParam);
}
