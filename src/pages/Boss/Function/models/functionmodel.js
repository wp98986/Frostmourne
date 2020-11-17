import { list, add, update, find, remove, authlist } from '@/services/functionAPI';
import { response2PageList } from '@/utils/requestUtils';

export default {
  namespace: 'functionmodel',

  state: {
    data: {
      model: {},
      list: [],
      authList: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload = {} }, { call, put }) {
      const { current: page, ...others } = payload;
      const response = yield call(list, { page, ...others });
      const { list: listData, pagination } = response2PageList(payload, response);
      yield put({
        type: 'save',
        payload: { list: listData, pagination },
      });
    },
    *fetchAuth({ payload }, { call, put }) {
      const response = yield call(authlist, payload);
      const { data } = response;
      yield put({
        type: 'saveAuth',
        payload: data,
      });
    },
    *fetchCurrent({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      const { data } = response;
      yield put({
        type: 'save',
        payload: { model: data },
      });
      if (callback) callback(data);
    },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      const { current, pageSize } = yield select(state => state.functionmodel.data.pagination);
      yield put({
        type: 'fetch',
        payload: { current, pageSize },
      });
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *update({ payload, callback }, { select, call, put }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      const { current, pageSize } = yield select(state => state.functionmodel.data.pagination);
      yield put({
        type: 'fetch',
        payload: { current, pageSize },
      });
    },
  },

  reducers: {
    save(state, action) {
      const { data } = state;
      let newData = action.payload || {};
      newData = { ...data, ...newData };
      return {
        ...state,
        data: newData,
      };
    },
    saveAuth(state, action) {
      const { data } = state;
      data.authList = action.payload;
      return {
        ...state,
        data,
      };
    },
  },
};
