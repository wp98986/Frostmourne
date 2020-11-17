// import _ from 'lodash';
import { baseQuery, baseFind } from '../baseMockService';

// 列表
const dataSource = [];
for (let i = 1; i < 46; i += 1) {
  dataSource.push({
    id: i,
    name: `渠道人${i}`,
    code: `c${i}`,
    mobile: '18316497977',
    type: 'promotioner',
    enableFlag: true,
    allotRatio: 0.8,
    remark: '备注一下',
    createTime: new Date(`2018-10-${Math.floor(i / 2) + 1}`),
    lastModifyTime: new Date(`2018-10-${Math.floor(i / 2) + 1}`),
  });
}

// function queryFilter(queryParam, data) {
//   const { docType, name, auths: authsCondition } = queryParam;
//   return (
//     (!docType || data.docType === docType) &&
//     (!name || (data.name && data.name.indexOf(name) > -1)) &&
//     (!authsCondition ||
//       authsCondition.length === 0 ||
//       _.some(data.auths, auth => authsCondition.indexOf(auth) > -1))
//   );
// }

const response = {
  data: { code: '203', message: '成功', messageCode: 'SUCCESS' },
  success: true,
  errorMessage: '',
  readTime: '2018-12-25T07:09:04.544+0000',
};

export default {
  'GET /site/channel/list': baseQuery(dataSource),
  'GET /site/channel/find': baseFind(dataSource),
  'POST /site/channel/add': response,
  'POST /site/channel/update': response,
  'POST /site/channel/del': response,
};
