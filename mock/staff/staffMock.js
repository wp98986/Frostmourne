import _ from 'lodash';
import { baseQuery, baseFind } from '../baseMockService';

// 列表
const functionDataSource = [];
for (let i = 0; i < 46; i += 1) {
  functionDataSource.push({
    id: i,
    user: {
      name: `人员${i}`,
      realName: `人员${i}`,
    },
    enableFlag: true,
    isDefault: true,
    site: 'boss',
    lastModifyDate: new Date(`2018-10-${Math.floor(i / 2) + 1}`),
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
  'GET /boss/staff/list': baseQuery(functionDataSource, queryFilter),
  'GET /site/staff/list': baseQuery(functionDataSource, queryFilter),
  'GET /site/staff/find': baseFind(functionDataSource),
  'GET /boss/staff/find': baseFind(functionDataSource),
};
