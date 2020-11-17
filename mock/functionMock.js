import _ from 'lodash';

import { baseAdd, baseRemove, baseUpdate, baseQuery } from './baseMockService';
import { auths } from './mockdata/functionMock.json';

let sequence = 0;

// mock functionDataSource
const functionDataSource = [];
for (let i = 0; i < 46; i += 1) {
  const { data: realAuths } = auths;
  const mockAuths = [realAuths[i % 20].value];
  sequence += 1;
  functionDataSource.push({
    id: sequence,
    name: `FunctionModel ${i}`,
    site: i % 2 === 0 ? 'boss' : 'site',
    docType: i % 2 === 0 ? 'app' : 'appShop',
    helpRemark: '这是一段描述',
    lastModifyDate: new Date(`2018-10-${Math.floor(i / 2) + 1}`),
    auths: mockAuths,
    pages: [{ page: 'boss.menu.boss.function', btns: ['edit'] }],
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

function convertParamToModel(updateParam) {
  sequence += 1;
  return { ...updateParam, id: sequence };
}

function authList(req, res) {
  return res.json(auths);
}

export default {
  'GET /boss/function/list': baseQuery(functionDataSource, queryFilter),
  'GET /boss/function/authlist': authList,
  'POST /boss/function/add': baseAdd(functionDataSource, convertParamToModel),
  'POST /boss/function/update': baseUpdate(functionDataSource),
  'POST /boss/function/delete': baseRemove(functionDataSource),
};
