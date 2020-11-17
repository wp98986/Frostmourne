import { getWithPrefix, postWithPrefix } from '@/utils/request';

export async function list(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return getWithPrefix('/account/list', queryParam);
}

export async function find(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return getWithPrefix('/account/find', queryParam);
}

export async function add(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/add', formData);
}

export async function update(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/update', formData);
}

export async function del(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/del', formData);
}

export async function addbank(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/addbankcard', formData);
}

export async function changeflag(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/changeflag', formData);
}
export async function updatedefault(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/updatedefault', formData);
}

export async function closeaccount(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/closebankaccount', formData);
}

export async function openaccount(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/openbankaccount', formData);
}

export async function findbankdetail(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return getWithPrefix('/bankdetail/list', queryParam);
}
export async function bankbalancecheck(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/bankbalancecheck', formData);
}

export async function openbankcheck(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/account/openbankcheck', formData);
}
