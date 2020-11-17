// import _ from 'lodash';
import { baseQuery, baseFind } from '../baseMockService';

// 列表
const dataSource = [];
for (let i = 1; i < 46; i += 1) {
  dataSource.push({
    id: i,
    name: `属性包${i}`,
    isValid: true,
    type: 'customer',
    code: `p${i}`,
    remark: '备注',
    list: [
      {
        name: '属性1',
        type: 'input',
        isRequired: true,
        optionValue: '别墅,公寓',
        sortNo: '1',
        defaultValue: '别墅',
        remark: '属性备注',
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

// const orgData = { data:[] };
// orgData.data.push({
//   id: 1,
//   orgName: `经销商${1}`,
//   orgCode: `C${1}`,
//   contact: '张三丰',
//   mobile: '13918640506',
//   province: '广东',
//   city: '佛山',
//   district: '顺德区',
//   address: '东乐路路路路路路路路路路路路路路路路路路路路路路路路路路路路路路路',
//   enableFlag: true,
// });

export default {
  'GET /boss/propertybag/list': baseQuery(dataSource),
  'GET /boss/propertybag/find': baseFind(dataSource),
  'POST /boss/propertybag/add': response,
  'POST /boss/propertybag/update': response,
  'POST /boss/propertybag/del': response,
  'GET /site/propertybag/list': baseQuery(dataSource),
  'GET /site/propertybag/find': baseFind(dataSource),
  'POST /site/propertybag/add': response,
  'POST /site/propertybag/update': response,
  'POST /site/propertybag/del': response,
};
