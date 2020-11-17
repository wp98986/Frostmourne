import { fetchList, fetchView, update, add, fecthFunctions, del, fecthApps } from '@/services/role';

export default {
  namespace: 'role',

  state: {
    list: [],
    view: {},
    formData: {},
    functions: [],
    apps: [],
  },

  effects: {
    // BOSS端
    *fetchList({ payload }, { call, put }) {
      const response = yield call(fetchList, payload);
      if (!response) return;
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *fetchView({ payload, callback }, { call, put }) {
      const response = yield call(fetchView, payload);
      if (!response) return;
      yield put({
        type: 'saveView',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(del, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *fecthFunctions({ payload }, { call, put }) {
      const response = yield call(fecthFunctions, payload);
      if (!response) return;
      yield put({
        type: 'saveFunctions',
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
  },

  reducers: {
    saveList(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        list: data,
      };
    },
    saveFunctions(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        functions: data,
      };
    },
    saveView(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        view: data,
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
    saveFormData(state, { payload }) {
      return {
        ...state,
        formData: {
          ...state.data,
          ...payload,
        },
      };
    },
  },
};
