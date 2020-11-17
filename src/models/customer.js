import { querycustomerlist, fetchDesign, customercount } from '@/services/customerAPI';
import { selectManageStores } from '@/services/storeAPI';

let custListController;

export default {
  namespace: 'publiccustomer',

  state: {
    customerlist: [],
    stores: [],
    designers: [],
  },

  effects: {
    *fetchcustlist({ payload = {} }, { call, put }) {
      // 客户列表
      if (custListController) {
        custListController.abort();
        custListController = null;
        return;
      }
      custListController = new AbortController();
      const response = yield call(querycustomerlist, payload, {
        signal: custListController.signal,
      });
      const { data = [] } = response || {};

      // if (callback) callback(response);
      yield put({
        type: 'querycustomer',
        payload: data,
      });
    },

    *fetchStores({ payload }, { put, call }) {
      const response = yield call(selectManageStores, payload);
      if (!response) return;
      yield put({
        type: 'saveStores',
        payload: response,
      });
    },

    *fetchDesign({ payload }, { put, call }) {
      const response = yield call(fetchDesign, payload);
      if (!response) return;
      yield put({
        type: 'saveDesign',
        payload: response,
      });
    },

    *fetchCount({ payload }, { put, call }) {
      const response = yield call(customercount, payload);
      if (!response) return;
      const count = response.data || 0;
      yield put({
        type: 'queryCount',
        payload: { count, type: payload.type },
      });
    },
  },

  reducers: {
    querycustomer(state, { payload }) {
      return {
        ...state,
        customerlist: payload,
      };
    },

    saveStores(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        stores: data,
      };
    },

    saveDesign(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        designers: data,
      };
    },

    queryCount(
      state,
      {
        payload: { type, count },
      }
    ) {
      const name = `${type}Count`;
      return {
        ...state,
        [name]: count,
      };
    },
  },
};
