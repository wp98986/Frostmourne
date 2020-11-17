import { get, post, getWithPrefix } from '@/utils/request';

export async function list(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return get('/boss/homepage/list', queryParam);
}

export async function wxlist(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return get('/boss/homepage/wxlist', queryParam);
}

export async function content(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/homepage/find', queryParam);
}

export async function info() {
  return getWithPrefix('/homepage/info');
}

export async function update(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/homepage/submit', formData);
}

export async function del(params = {}) {
  const updateParam = { updateParam: JSON.stringify(params) };
  return get('/boss/homepage/del', updateParam);
}
