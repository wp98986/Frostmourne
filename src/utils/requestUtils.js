export function response2PageList(queryParam = {}, response = {}) {
  const { current = 1, pageSize = 10 } = queryParam;
  const { data: { modelList = [], totalCount: total } = {} } = response;
  return { list: modelList, pagination: { current, pageSize, total } };
}

export function response2Model() {
  // TODO
}
