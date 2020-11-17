// import _ from 'lodash';
import { baseQuery, baseFind } from '../baseMockService';

// 列表
const dataSource = [];
for (let i = 1; i < 46; i += 1) {
  dataSource.push({
    id: i,
    name: `客户${i}`,
    mobile: '18316497977',
    sex: '男',
    stage: 'inStore',
    store: { name: `门店${i}`, id: i },
    designer: { name: '设计师', id: i },
    province: '广东',
    city: '佛山',
    district: '顺德区',
    address: '大良街道东城花园三期2座201',
    houseArea: 122,
    building: { name: '绿地', id: 1 },
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

const designers = {
  data: [
    {
      name: '张伦',
      id: 1,
    },
    {
      name: '张三',
      id: 2,
    },
  ],
};

const records = [];
for (let i = 0; i < 46; i += 1) {
  records.push({
    dasign: { name: '张伦', id: 1 },
    id: i,
    doTime: new Date(),
    content: '沟通得不错',
    remark:
      '很好的设计方案很好的设计方案很好的设计方案很好的设计方案很好的设计方案很好的设计方案很好的设计方案很好的设计方案很好的设计方案',
    customerStage: 'inStore',
  });
}

const plans = [];
for (let i = 0; i < 46; i += 1) {
  plans.push({
    user: { name: '张导购', id: 1 },
    id: i,
    name: `方案${i}`,
    createTime: new Date(),
    amt: 8888,
    // img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546583197&di=4ee6912fd44689cb5bfb59b79d637913&imgtype=jpg&er=1&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fbaike%2Fc0%253Dbaike80%252C5%252C5%252C80%252C26%253Bt%253Dgif%2Fsign%3Da8bad9538db1cb132a643441bc3d3d2b%2F1c950a7b02087bf496c3e555f2d3572c11dfcf5b.jpg'
  });
}

const buildings = { data: [] };
buildings.data.push({
  user: { name: '张导购', id: 1 },
  id: 1,
  name: `楼盘${1}`,
  createTime: new Date(),
  amt: 8888,
  // img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546583197&di=4ee6912fd44689cb5bfb59b79d637913&imgtype=jpg&er=1&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fbaike%2Fc0%253Dbaike80%252C5%252C5%252C80%252C26%253Bt%253Dgif%2Fsign%3Da8bad9538db1cb132a643441bc3d3d2b%2F1c950a7b02087bf496c3e555f2d3572c11dfcf5b.jpg'
});

const stores = {
  data: [
    {
      id: 1,
      name: `门店${1}`,
      createTime: new Date(),
    },
    {
      id: 2,
      name: `门店${2}`,
      createTime: new Date(),
    },
  ],
};

const orders = [];
for (let i = 0; i < 46; i += 1) {
  orders.push({
    orderCode: '201901070916',
    id: i + 10,
    designer: { name: '设计师', id: i },
    orderStatus: '支付中',
    orderGoodsInfos: [
      {
        id: i + 100,
        goodsInfo: {
          goodsInfoName: `某单品${i}`,
          goodsInfoImgId:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545995611231&di=b0e66bfde1423a36f9176b839b8322dd&imgtype=0&src=http%3A%2F%2Fimgmall.tg.com.cn%2Fgroup2%2FM00%2F6C%2F69%2FCgooeFlOD0PLhdQnAAEv2O8BFnw551.jpg',
          goodsInfoPreferPrice: 66,
          goodsOpenSpecValues: [
            {
              spec: { specName: '属性1' },
              specValueRemark: '件',
            },
            {
              spec: { specName: '属性2' },
              specValueRemark: '100*100',
            },
          ],
        },
        goodsInfoSumPrice: 66,
        goodsInfoNum: 1,
      },
      {
        id: i + 200,
        goodsInfo: {
          goodsInfoName: '某单品',
          goodsInfoImgId:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545995611231&di=b0e66bfde1423a36f9176b839b8322dd&imgtype=0&src=http%3A%2F%2Fimgmall.tg.com.cn%2Fgroup2%2FM00%2F6C%2F69%2FCgooeFlOD0PLhdQnAAEv2O8BFnw551.jpg',
          goodsInfoPreferPrice: 3333,
          goodsOpenSpecValues: [
            {
              spec: { specName: '属性1' },
              specValueRemark: '件',
            },
            {
              spec: { specName: '属性2' },
              specValueRemark: '100*100',
            },
          ],
        },
        goodsInfoSumPrice: 6666,
        goodsInfoNum: 2,
      },
    ],
    createTime: new Date(),
    // img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546583197&di=4ee6912fd44689cb5bfb59b79d637913&imgtype=jpg&er=1&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fbaike%2Fc0%253Dbaike80%252C5%252C5%252C80%252C26%253Bt%253Dgif%2Fsign%3Da8bad9538db1cb132a643441bc3d3d2b%2F1c950a7b02087bf496c3e555f2d3572c11dfcf5b.jpg'
  });
}

const propertys = {
  data: {
    code: 'C001',
    createdate: '2019-01-04 11:24:34.000',
    id: 9,
    isValid: true,
    lastModifyDate: '2019-01-09 15:48:25.000',
    name: '客户标签标准1.0',
    orgId: 1,
    propertys: [
      {
        defaultValue: '',
        id: 12,
        isRequired: true,
        name: '房屋面积',
        optionValue: '',
        propertyBagId: 9,
        remark: '',
        sortNo: '',
        type: 'input',
      },
      {
        defaultValue: '',
        id: 13,
        isRequired: true,
        name: '户型信息',
        optionValue: '二室一厅,三室一厅,三室两厅',
        propertyBagId: 9,
        remark: '',
        sortNo: '',
        type: 'radio',
      },
      {
        defaultValue: '精装修',
        id: 14,
        isRequired: true,
        name: '特色',
        optionValue: '精装修,交通方便',
        propertyBagId: 9,
        remark: '',
        sortNo: '',
        type: 'checkbox',
      },
      {
        defaultValue: '',
        id: 16,
        isRequired: true,
        name: '特色2',
        optionValue: '地平已做,墙已刷',
        propertyBagId: 9,
        remark: '',
        sortNo: '',
        type: 'radio',
      },
      {
        defaultValue: '',
        id: 18,
        isRequired: true,
        name: '特色3',
        optionValue: '啊,哈,横,哼,亨,恆,1,2,3,4,45,56,6,7,8,9',
        propertyBagId: 9,
        remark: '',
        sortNo: '',
        type: 'checkbox',
      },
      {
        defaultValue: '',
        id: 19,
        isRequired: true,
        name: '单选测试',
        optionValue: '1,2,3,4,5',
        propertyBagId: 9,
        remark: '',
        sortNo: '',
        type: 'radio',
      },
    ],
    type: 'customer',
  },
  success: true,
  errorMessage: '',
  readTime: '2019-01-10 10:42:48.857',
};

export default {
  'GET /site/customer/list': baseQuery(dataSource),
  'GET /site/customer/find': baseFind(dataSource),
  'GET /site/staff/designers': designers,
  'GET /site/communicationrecord/list': baseQuery(records),
  'GET /site/plans/list': baseQuery(plans),
  'GET /site/order/customerorderlist': baseQuery(orders),
  'GET /site/building/select': buildings,
  'GET /site/staff/select': designers,
  'GET /site/propertybag/findcustext': propertys,
  'GET /site/store/managestores': stores,
  'POST /site/communicationrecord/del': response,
  'POST /site/communicationrecord/add': response,
  'POST /site/communicationrecord/update': response,
  'POST /site/customer/add': response,
  'POST /site/customer/update': response,
  'POST /site/customer/del': response,
};
