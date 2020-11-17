import { getWithPrefix } from '@/utils/request';

export async function queryNotices(params) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return getWithPrefix('/notification/list', queryParam);
}

export async function notocehasread(params) {
  const updateParam = { updateParam: JSON.stringify(params) };
  return getWithPrefix('/notification/hasread', updateParam);
}

export async function noticesCount(params) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return getWithPrefix('/notification/count', queryParam);
}
