import * as TestAPI from '@/services/TestAPI';
import { response2PageList } from '@/utils/requestUtils';

export default {
  namespace: 'homepageModel',

  state: {
    dataList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const { current: page, ...others } = payload;
      const response = yield call(TestAPI.newgoodslist, { page, ...others });
      const { list: listData, pagination } = response2PageList(payload, response);
      yield put({
        type: 'saveList',
        payload: { list: listData, pagination },
      });
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const { dataList } = state;
      let newData = payload || {};
      newData = { ...dataList, ...newData };
      return {
        ...state,
        dataList: newData,
      };
    },
  },
};
