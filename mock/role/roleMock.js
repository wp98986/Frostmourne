import _ from 'lodash';
import { baseQuery, baseFind } from '../baseMockService';

// 列表
const functionDataSource = [];
for (let i = 0; i < 46; i += 1) {
  functionDataSource.push({
    id: i,
    name: `角色${i}`,
    app: { id: i, name: '666' },
    enableFlag: true,
    isDefault: true,
    site: 'boss',
    lastModifyDate: new Date(`2018-10-${Math.floor(i / 2) + 1}`),
    functions: [{ id: 3, name: '666' }],
    remark: i,
  });
}

function queryFilter(queryParam, data) {
  const { docType, name, auths: authsCondition } = queryParam;
  return (
    (!docType || data.docType === docType) &&
    (!name || (data.name && data.name.indexOf(name) > -1)) &&
    (!authsCondition ||
      authsCondition.length === 0 ||
      _.some(data.auths, auth => authsCondition.indexOf(auth) > -1))
  );
}

export default {
  'GET /boss/role/originallist': baseQuery(functionDataSource, queryFilter),
  'GET /boss/role/list': baseQuery(functionDataSource, queryFilter),
  'GET /site/role/list': baseQuery(functionDataSource, queryFilter),
  'GET /boss/role/find': baseFind(functionDataSource),
};
