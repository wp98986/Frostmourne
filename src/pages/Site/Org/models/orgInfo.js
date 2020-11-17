import {
  fetchInvite,
  orgFind,
  fetchDepts,
  fetchStaffs,
  fetchPos,
  saveDept,
  updateDept,
  delDept,
  fetchDeptSelect,
  findStaff,
  saveStaff,
  updateStaff,
  updateStaffRole,
  delStaff,
  updateOrg,
  resetPwd,
  findCurrentProtocol,
  fetchInviteCode,
  saveInviteCode,
  editInviteCode,
  delInviteCode,
  changeProtocol,
  sendVerCode,
  setPwd,
} from '@/services/org';
import { selectStores } from '@/services/storeAPI';
import { roleList } from '@/services/role';
import { response2PageList } from '@/utils/requestUtils';
import * as distributOrgAPI from '@/services/distributOrgAPI';
import * as accountsAPI from '@/services/accountsAPI';

export default {
  namespace: 'orgInfo',
  state: {
    view: {},
    depts: [],
    staffs: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
    pos: [],
    deptsEnum: [],
    roles: [],
    stores: [],
    invitedorgs: [],
    orgs: {},
    protocols: [],
    inviteCodeList: [],
    accounts: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },

  effects: {
    *fetchInvite({ payload }, { call, put }) {
      const response = yield call(fetchInvite, payload);
      if (!response) return;
      yield put({
        type: 'saveOrgs',
        payload: response,
      });
    },
    *fetchView({ payload, callback }, { call, put }) {
      const response = yield call(orgFind, payload);
      if (!response) return;
      yield put({
        type: 'saveView',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchDepts({ payload }, { call, put }) {
      const response = yield call(fetchDepts, payload);
      if (!response) return;
      yield put({
        type: 'saveDepts',
        payload: response,
      });
    },
    *updateOrg({ payload, callback }, { call }) {
      const response = yield call(updateOrg, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *fetchDeptSelect({ payload }, { call, put }) {
      const response = yield call(fetchDeptSelect, payload);
      if (!response) return;
      yield put({
        type: 'saveDeptsEnum',
        payload: response,
      });
    },
    *fetchStaffs({ payload = {} }, { call, put }) {
      const { page = 1, ...others } = payload;
      const response = yield call(fetchStaffs, { ...payload, pageSize: 10, page, ...others });
      if (!response) return;
      const { list: listData, pagination } = response2PageList(
        { current: page, pageSize: 10, ...others },
        response
      );
      yield put({
        type: 'saveStaffs',
        payload: { list: listData, pagination },
      });
    },
    *fetchPos({ payload }, { call, put }) {
      const response = yield call(fetchPos, payload);
      if (!response) return;
      yield put({
        type: 'savePos',
        payload: response,
      });
    },
    *findStaff({ payload, callback }, { call }) {
      const response = yield call(findStaff, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *saveDept({ payload, callback }, { call }) {
      const response = yield call(saveDept, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *updateDept({ payload, callback }, { call }) {
      const response = yield call(updateDept, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *delDept({ payload, callback }, { call }) {
      const response = yield call(delDept, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *saveStaff({ payload, callback }, { call }) {
      const response = yield call(saveStaff, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *updateStaff({ payload, callback }, { call }) {
      const response = yield call(updateStaff, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *updateStaffRole({ payload, callback }, { call }) {
      const response = yield call(updateStaffRole, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *delStaff({ payload, callback }, { call }) {
      const response = yield call(delStaff, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *roleList({ payload }, { call, put }) {
      const response = yield call(roleList, payload);
      if (!response) return;
      yield put({
        type: 'saveRoleList',
        payload: response,
      });
    },
    *fetchStores({ payload }, { call, put }) {
      const response = yield call(selectStores, payload);
      if (!response) return;
      yield put({
        type: 'saveStoresList',
        payload: response,
      });
    },
    *staffResetPwd({ payload, callback }, { call }) {
      const response = yield call(resetPwd, payload);
      if (!response) return;
      if (callback) callback(response);
    },

    *invite({ payload, callback }, { call }) {
      const response = yield call(distributOrgAPI.invite, payload);
      if (!response) return;
      if (callback) callback(response);
    },

    *fetchCurrentProtocols({ payload }, { call, put }) {
      const response = yield call(findCurrentProtocol, payload);
      if (!response) return;
      yield put({
        type: 'saveProtocols',
        payload: response,
      });
    },

    *fetchInviteCodeList({ payload }, { call, put }) {
      const response = yield call(fetchInviteCode, payload);
      if (!response) return;
      yield put({
        type: 'saveCodeList',
        payload: response,
      });
    },

    *saveCode({ payload, callback }, { call }) {
      const { id, protocolId } = payload;
      const response = yield call(
        id ? editInviteCode : saveInviteCode,
        id ? { id, protocolId } : { protocolId }
      );
      if (!response) return;
      if (callback) callback(response);
    },

    *delCode({ payload, callback }, { call }) {
      const response = yield call(delInviteCode, payload);
      if (!response) return;
      if (callback) callback(response);
    },

    *changeProto({ payload, callback }, { call }) {
      const response = yield call(changeProtocol, payload);
      if (!response) return;
      if (callback) callback(response);
    },

    *sendVerCode({ payload, callback }, { call }) {
      const response = yield call(sendVerCode, payload);
      if (!response) return;
      if (callback) callback(response);
    },

    *fetchChild({ payload }, { call, put }) {
      const { page = 1, ...others } = payload;
      const response = yield call(accountsAPI.list, { ...payload, pageSize: 5, page, ...others });
      if (!response) return;
      const { list: listData, pagination } = response2PageList(
        { current: page, pageSize: 10, ...others },
        response
      );
      yield put({
        type: 'saveChildList',
        payload: { list: listData, pagination },
      });
    },

    *updatePwd({ payload, callback }, { call }) {
      const response = yield call(setPwd, payload);
      if (!response) return;
      if (callback) callback(response);
    },
  },

  reducers: {
    saveView(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        view: data,
      };
    },
    saveRoleList(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        roles: data,
      };
    },
    saveDepts(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        depts: data,
      };
    },
    saveDeptsEnum(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        deptsEnum: data,
      };
    },
    saveStaffs(state, action) {
      const { data } = state;
      let newData = action.payload || {};
      newData = { ...data, ...newData };
      return {
        ...state,
        staffs: newData,
      };
    },
    savePos(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        pos: data,
      };
    },
    saveStoresList(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        stores: data,
      };
    },
    saveOrgs(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        orgs: data,
      };
    },

    setInviteList(state, { payload }) {
      const { orgs } = state;
      return {
        ...state,
        orgs: { ...orgs, modelList: payload },
      };
    },

    saveProtocols(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        protocols: data,
      };
    },

    saveCodeList(state, { payload }) {
      const { data: { modelList = [] } = {} } = payload;
      return {
        ...state,
        inviteCodeList: modelList,
      };
    },

    addCodeList(state, { payload }) {
      const { inviteCodeList = [] } = state;
      inviteCodeList.push(payload);
      return {
        ...state,
        inviteCodeList: [...inviteCodeList],
      };
    },

    setCodeList(state, { payload }) {
      return {
        ...state,
        inviteCodeList: payload,
      };
    },

    saveChildList(state, { payload = {} }) {
      return {
        ...state,
        accounts: payload,
      };
    },
  },
};
