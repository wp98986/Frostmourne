import { siteList } from '@/services/functionAPI';
import { response2PageList } from '@/utils/requestUtils';

export default {
  namespace: 'functions',

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
      const response = yield call(siteList, { page, ...others });
      const { list: listData, pagination } = response2PageList(payload, response);
      yield put({
        type: 'save',
        payload: { list: listData, pagination },
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
