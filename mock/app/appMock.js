import _ from 'lodash';
import { baseQuery, baseFind } from '../baseMockService';
// import list from './functions.json';

// 列表
const functionDataSource = [];
for (let i = 0; i < 46; i += 1) {
  functionDataSource.push({
    id: i,
    name: `应用${i}`,
    description: `这是第${i}个应用`,
    enableFlag: true,
    isDefault: true,
    site: 'boss',
    icon: ['https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png'],
    lastModifyDate: new Date(`2018-10-${Math.floor(i / 2) + 1}`),
    functions: [{ id: 3, name: '666' }],
  });
}

// function functionsList(req, res) {
//   return res.json(list);
// }

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
  // 'GET /boss/app/list': functionsList,
  'GET /boss/app/list': baseQuery(functionDataSource, queryFilter),
  'GET /boss/app/find': baseFind(functionDataSource),
};
