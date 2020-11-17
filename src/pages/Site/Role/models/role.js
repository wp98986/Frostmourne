import {
  roleList,
  fetchView,
  addRole,
  updateRole,
  deleteRole,
  addPermission,
  saveFunctions,
  siteFunctions,
  fecthApps,
} from '@/services/role';
import { orgFind } from '@/services/org';

export default {
  namespace: 'rolemanage',

  state: {
    list: [],
    functions: [],
    apps: [],
    orgInfo: {},
    info: {},
  },

  effects: {
    // SITE端
    *roleList({ payload }, { call, put }) {
      const response = yield call(roleList, payload);
      if (!response) return;
      yield put({
        type: 'saveRoleList',
        payload: response,
      });
    },
    *fetchInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchView, payload);
      if (!response) return;
      const { data } = response;
      yield put({
        type: 'saveRoleInfo',
        payload: response,
      });
      if (callback) callback(data);
    },
    *addRole({ payload, callback }, { call }) {
      const response = yield call(addRole, payload);
      if (!response) return;
      callback(response);
    },
    *updateRole({ payload, callback }, { call }) {
      const response = yield call(updateRole, payload);
      if (!response) return;
      callback(response);
    },
    *deleteRole({ payload, callback }, { call }) {
      const response = yield call(deleteRole, payload);
      if (!response) return;
      callback(response);
    },
    *addPermission({ payload, callback }, { call }) {
      const response = yield call(addPermission, payload);
      if (!response) return;
      callback(response);
    },
    *saveFunctions({ payload, callback }, { call }) {
      const response = yield call(saveFunctions, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *fecthFunctions({ payload }, { call, put }) {
      const response = yield call(siteFunctions, payload);
      if (!response) return;
      yield put({
        type: 'saveFunctions2',
        payload: response,
      });
    },
    *fecthApps({ payload }, { call, put }) {
      const response = yield call(fecthApps, payload);
      if (!response) return;
      yield put({
        type: 'saveApps',
        payload: response,
      });
    },
    *fetchOrgInfo({ payload }, { call, put }) {
      const response = yield call(orgFind, payload);
      if (!response) return;
      yield put({
        type: 'saveOrg',
        payload: response,
      });
    },
  },

  reducers: {
    // SITE端
    saveRoleList(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        list: data,
      };
    },
    saveRoleInfo(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        info: data,
      };
    },
    saveFunctions2(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        functions: data,
      };
    },
    saveApps(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        apps: data.modelList,
      };
    },
    saveOrg(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        orgInfo: data,
      };
    },
  },
};
