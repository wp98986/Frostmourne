import { postWithPrefix, getWithPrefix } from '@/utils/request';

export async function list(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return getWithPrefix('/staffinviterecord/list', queryParam);
}

export async function invite(params = {}) {
  const updateParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', updateParam);
  return postWithPrefix('/staff/sendinvitesms', formData);
}
