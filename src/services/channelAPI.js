import { get, post } from '@/utils/request';

export async function list(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/channel/list', queryParam);
}

export async function selectChannels(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/channel/select', queryParam);
}

export async function selectStores(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/channel/select', queryParam);
}

export async function find(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/channel/find', queryParam);
}

export async function update(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/channel/update', formData);
}

export async function add(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/channel/add', formData);
}

export async function del(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/site/channel/del', formData);
}
