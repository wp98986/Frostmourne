// import _ from 'lodash';
import { baseQuery, baseFind } from '../baseMockService';

// 列表
const dataSource = [];
for (let i = 1; i < 46; i += 1) {
  dataSource.push({
    id: i,
    name: `协议${i}`,
    isValid: 'true',
    remark: '备注',
    details: [
      {
        priceType: 'business',
        basicRatio: '1.2',
        rebateRatio: '80',
        discountRatio: '80',
      },
    ],
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
  data: { code: '203', message: '成功', messageCode: 'SUCCESS', resultId: 1 },
  success: true,
  errorMessage: '',
  readTime: '2018-12-25T07:09:04.544+0000',
};

export default {
  'GET /boss/protocol/list': baseQuery(dataSource),
  'GET /boss/protocol/find': baseFind(dataSource),
  'POST /boss/protocol/add': response,
  'POST /boss/protocol/update': response,
  'POST /boss/protocol/del': response,
};
