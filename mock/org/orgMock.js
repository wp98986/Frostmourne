import _ from 'lodash';
import { baseQuery } from '../baseMockService';

// 列表
const functionDataSource = [];
for (let i = 0; i < 46; i += 1) {
  functionDataSource.push({
    id: i,
    orgName: `企业${i}`,
    orgCode: `C${i}`,
    contact: '张三丰',
    mobile: '13918640506',
    province: '广东',
    city: '佛山',
    district: '顺德区',
    address: '东乐路路路路路路路路路路路路路路路路路路路路路路路路路路路路路路路',
    enableFlag: true,
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    lastModifyDate: new Date(`2018-10-${Math.floor(i / 2) + 1}`),
    appAuths: [{ app: { name: 'mock', id: 1 } }],
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
  'GET /boss/org/list': baseQuery(functionDataSource, queryFilter),
  'GET /site/org/find': {
    data: {
      orgName: '自然优品',
      logo:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
      contact: '周铁柱',
      mobile: '13918640506',
      province: '广东省',
      city: '佛山市',
      district: '顺德区',
      address: '东乐路',
      appAuths: [
        {
          app: {
            id: 1,
            icon:
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
            name: '应用666',
          },
        },
      ],
    },
  },
  'GET /boss/org/find': {
    data: {
      orgName: '自然优品',
      logo:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
      contact: '周铁柱',
      mobile: '13918640506',
      province: '广东省',
      city: '佛山市',
      district: '顺德区',
      address: '东乐路',
      appAuths: [
        {
          app: {
            id: 1,
            icon:
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
            name: '应用666',
          },
        },
      ],
    },
  },
  'GET /site/dept/list': {
    data: [
      {
        name: '技术部',
        id: 1,
        children: [
          {
            name: '运营部',
            id: 3,
            children: [
              {
                name: '清洁部',
                id: 4,
              },
            ],
          },
        ],
      },
      {
        name: '市场部',
        id: 2,
      },
    ],
  },
  'GET /site/staff/list': {
    data: [
      {
        userName: '张三',
        dept: {
          name: '技术部',
        },
        position: {
          id: 1,
          name: '负责人',
        },
        id: 1,
      },
      {
        userName: '李四',
        dept: {
          name: '技术部',
        },
        position: {
          id: 2,
          name: '管理者',
        },
        id: 2,
      },
    ],
  },
  'GET /site/position/list': {
    data: [
      {
        name: '负责人',
        id: 1,
      },
      {
        name: '管理者',
        id: 2,
      },
    ],
  },
  'GET /boss/dept/childlist': {
    data: [
      {
        id: 92,
        name: '测试',
        remark: null,
        leader: {
          id: null,
          enableFlag: null,
          isCreator: null,
          invitationCode: null,
          refereeId: null,
          remark: null,
          dept: null,
          org: null,
          user: null,
          createdate: null,
          lastModifyDate: null,
          roles: null,
          depts: null,
          auths: null,
          pages: null,
          orgId: null,
          userId: null,
          deptId: null,
        },
        parent: {
          id: 0,
          name: null,
          remark: null,
          leader: null,
          parent: null,
          org: null,
          children: null,
          createdate: null,
          lastModifyDate: null,
          parentId: null,
        },
        org: {
          id: 47,
          name: null,
          code: null,
          inviteCode: null,
          contact: null,
          mobile: null,
          province: null,
          city: null,
          district: null,
          address: null,
          enableFlag: null,
          remark: null,
          createdate: null,
          lastModifyDate: null,
          appAuths: null,
        },
        children: null,
        createdate: '2018-12-24T05:13:46.000+0000',
        lastModifyDate: '2018-12-24T05:13:46.000+0000',
        parentId: 0,
      },
    ],
    success: true,
    errorMessage: '',
    readTime: '2018-12-25T07:14:36.496+0000',
  },
  'GET /site/dept/childlist': {
    data: [
      {
        id: 92,
        name: '测试',
        remark: null,
        leader: {
          id: null,
          enableFlag: null,
          isCreator: null,
          invitationCode: null,
          refereeId: null,
          remark: null,
          dept: null,
          org: null,
          user: null,
          createdate: null,
          lastModifyDate: null,
          roles: null,
          depts: null,
          auths: null,
          pages: null,
          orgId: null,
          userId: null,
          deptId: null,
        },
        parent: {
          id: 0,
          name: null,
          remark: null,
          leader: null,
          parent: null,
          org: null,
          children: null,
          createdate: null,
          lastModifyDate: null,
          parentId: null,
        },
        org: {
          id: 47,
          name: null,
          code: null,
          inviteCode: null,
          contact: null,
          mobile: null,
          province: null,
          city: null,
          district: null,
          address: null,
          enableFlag: null,
          remark: null,
          createdate: null,
          lastModifyDate: null,
          appAuths: null,
        },
        children: null,
        createdate: '2018-12-24T05:13:46.000+0000',
        lastModifyDate: '2018-12-24T05:13:46.000+0000',
        parentId: 0,
      },
    ],
    success: true,
    errorMessage: '',
    readTime: '2018-12-25T07:14:36.496+0000',
  },
};
