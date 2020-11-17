import { postWithPrefix } from '@/utils/request';

export async function newgoodslist(params = {}) {
  const formData = new FormData();
  formData.append('queryParam', JSON.stringify(params));
  // const queryParam = { queryParam: JSON.stringify(params) };
  return postWithPrefix('/goods/list', formData);
}

export async function newgoodslist2() {
  //
}
