import { post, getWithPrefix, postWithPrefix } from '@/utils/request';

export async function queryCurrent() {
  return getWithPrefix('/staff/currentinfo');
}

export async function queryChangeList(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/staff/changelist', queryParam);
}

export async function change(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('queryParam', queryParam);
  return postWithPrefix('/change', formData);
}

export async function savePersonalInfo(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/user/update', formData);
}

export async function updatePart(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/user/updatepart', formData);
}

export async function modPwd(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/user/updatepwd', formData);
}

export async function getCaptcha(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('queryParam', updateParam);
  return postWithPrefix('/sendmsg', formData);
}

export async function forgetPwd(params) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/forgetpassword', formData);
}

export async function setPwd(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/forgetpassword', formData);
}

export async function joinOrg(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/site/staff/joinorg', formData);
}

export async function invitePerson(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/staff/sendinvitesms', formData);
}

export async function verificateStr(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/yzmstr', formData);
}

// export async function hasSetTradepassword() {
//   return getWithPrefix('/user/hastradepassword');
// }

export async function settradepassword(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/user/settradepassword', formData);
}
