import { get, post, getWithPrefix } from '@/utils/request';

// BOSS端
export async function list(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/propertybag/list', queryParam);
}

export async function find(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/boss/propertybag/find', queryParam);
}

export async function findProperty(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/propertybag/findproperty', queryParam);
}

export async function update(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/propertybag/update', formData);
}

export async function updateProperty(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/propertybag/propertysubmit', formData);
}

export async function add(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/propertybag/add', formData);
}

export async function del(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return post('/boss/propertybag/del', formData);
}

// SITE端
export async function custPropertys(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/propertybag/findcustext', queryParam);
}

export async function findpricerange(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/propertybag/findproperty', queryParam);
}
