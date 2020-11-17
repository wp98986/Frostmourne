import { get, post } from '@/utils/request';

export async function register(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/site/regist', formData);
}

export async function joinorg(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/site/joinorg', formData);
}

export async function sendMsg(params) {
  const newParams = params || {};
  const updateParam = { updateParam: JSON.stringify(newParams) };
  return get('/polarbear/agcy/agcyregistsendmsg', updateParam);
}
