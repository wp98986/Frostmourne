import { get, post, postWithPrefix, getWithPrefix } from '@/utils/request';

// BOSS端
export async function fetchList(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/org/list', queryParam);
}

export async function audit(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/boss/org/audit', formData);
}

export async function auditrevoke(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/boss/org/auditrevoke', formData);
}

export async function fetchView(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/org/find', queryParam);
}

export async function update(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/boss/org/update', formData);
}

export async function updateOrg(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/org/updatepart', formData);
}

export async function saveOrg(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/boss/org/add', formData);
}

// SITE端
export async function select(params, options = {}) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/org/select', queryParam, options);
}

export async function orgFind(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/org/find', queryParam);
}

export async function fetchDepts(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/dept/childlist', queryParam);
}

export async function fetchDeptSelect(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/dept/select', queryParam);
}

export async function findStaff(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/staff/find', queryParam);
}

export async function fetchStaffs(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/staff/list', queryParam);
}

export async function saveStaff(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/staff/add', formData);
}

export async function updateStaff(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/staff/update', formData);
}

export async function updateStaffRole(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/staff/updaterole', formData);
}

export async function delStaff(params) {
  const newParams = params || {};
  const updateParam = { updateParam: JSON.stringify(newParams) };
  return getWithPrefix('/staff/del', updateParam);
}

export async function fetchPos(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/dept/childlist', queryParam);
}

export async function saveDept(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/dept/add', formData);
}

export async function updateDept(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/dept/update', formData);
}

export async function delDept(params) {
  const newParams = params || {};
  const updateParam = { updateParam: JSON.stringify(newParams) };
  return getWithPrefix('/dept/del', updateParam);
}

export async function addOrg(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return post('/site/org/add', formData);
}

export async function resetPwd(params) {
  const queryParam = JSON.stringify(params);
  const formData = new FormData();
  formData.append('updateParam', queryParam);
  return postWithPrefix('/staff/resetpassword', formData);
}

export async function fetchInvite(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return getWithPrefix('/staffinviterecord/list', queryParam);
}

export async function orginvitelist(params) {
  const newParams = params || {};
  const queryParam = { queryParam: JSON.stringify(newParams) };
  return get('/site/org/orginvitelist', queryParam);
}

export async function findStaffList(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return getWithPrefix('/staff/select', queryParam);
}

export async function findCurrentProtocol() {
  // const queryParam = { queryParam: JSON.stringify(params) };
  return getWithPrefix('/org/protocols');
}

export async function fetchInviteCode(params = {}) {
  const queryParam = { queryParam: JSON.stringify(params) };
  return getWithPrefix('/staff/invitecodelist', queryParam);
}

export async function saveInviteCode(params = {}) {
  const updateParam = { updateParam: JSON.stringify(params) };
  return getWithPrefix('/staff/addinvitecode', updateParam);
}

export async function editInviteCode(params = {}) {
  const updateParam = { updateParam: JSON.stringify(params) };
  return getWithPrefix('/staff/editinvitecode', updateParam);
}

export async function delInviteCode(params = {}) {
  const updateParam = { updateParam: JSON.stringify(params) };
  return getWithPrefix('/staff/delinvitecode', updateParam);
}

export async function changeProtocol(params = {}) {
  const updateParam = { updateParam: JSON.stringify(params) };
  return getWithPrefix('/staff/orgchangeprotocol', updateParam);
}

export async function sendVerCode(params = {}) {
  const updateParam = { updateParam: JSON.stringify(params) };
  return getWithPrefix('/org/sendtradmsg', updateParam);
}

export async function setPwd(params = {}) {
  const updateParam = { updateParam: JSON.stringify(params) };
  return getWithPrefix('/org/tradepwdupdae', updateParam);
}
