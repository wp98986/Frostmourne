import { fetchList, fetchView, update, add, del } from '@/services/app';
import { list } from '@/services/functionAPI';

export default {
  namespace: 'app',

  state: {
    list: [],
    view: {},
    functionsList: [],
    formData: {},
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
    *del({ payload, callback }, { call }) {
      const response = yield call(del, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *fetchFunctions({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (!response) return;
      yield put({
        type: 'saveFunctions',
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
    saveView(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        view: data,
      };
    },
    saveFunctions(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        functionsList: data,
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
