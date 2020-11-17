import { get, postWithPrefix } from '@/utils/request';

export async function login(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('queryParam', queryParam);
  return postWithPrefix('/login', formData);
}

export async function sendMsg(params) {
  const newParams = params || {};
  const updateParam = { updateParam: JSON.stringify(newParams) };
  return get('/boss/user/sendMsg', updateParam);
}
