// import _ from 'lodash';
import { baseQuery, baseFind } from '../baseMockService';

// 列表
const dataSource = [];
for (let i = 1; i < 46; i += 1) {
  dataSource.push({
    id: i,
    name: `门店${i}`,
    code: `md${i}`,
    contact: '苏东坡',
    mobile: '18316497977',
    org: { name: `经销商${i}`, id: i },
    province: '广东',
    city: '佛山',
    district: '顺德区',
    address: '大良街道东城花园三期2座201',
    locationType: 'others',
    type: 'others',
    startTime: new Date(`2018-10-${Math.floor(i / 2) + 1}`),
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

const orgData = { data: [] };
orgData.data.push({
  id: 1,
  orgName: `经销商${1}`,
  orgCode: `C${1}`,
  contact: '张三丰',
  mobile: '13918640506',
  province: '广东',
  city: '佛山',
  district: '顺德区',
  address: '东乐路路路路路路路路路路路路路路路路路路路路路路路路路路路路路路路',
  enableFlag: true,
});

export default {
  'GET /site/store/list': baseQuery(dataSource),
  'GET /site/store/find': baseFind(dataSource),
  'GET /site/org/select': orgData,
  'POST /site/store/add': response,
  'POST /site/store/update': response,
  'POST /site/store/del': response,
};
