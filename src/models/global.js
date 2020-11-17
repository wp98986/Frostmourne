import { queryNotices, notocehasread, noticesCount } from '@/services/noticeAPI';
import { response2PageList } from '@/utils/requestUtils';
// import MtaH5 from 'mta-h5-analysis';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
    designerNotices: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 6,
        total: 0,
      },
      noMore: false,
    },
    noticesCount: 0,
  },

  effects: {
    *fetchNotices({ payload = {} }, { call, put }) {
      const { page, reload, ...others } = payload;
      const response = yield call(queryNotices, { page, ...others });
      const { list: listData, pagination } = response2PageList(payload, response);
      pagination.current = page;
      yield put({
        type: 'saveNotices',
        payload: { list: listData, pagination, reload },
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: listData.length,
      });
    },

    *fetchDesignerNotices({ payload = {} }, { call, put, select }) {
      const { page, reload, needConcat, ...others } = payload;
      const response = yield call(queryNotices, { page, ...others });
      const { list: listData, pagination } = response2PageList(payload, response);
      let newList;
      if (needConcat) {
        const oldList = yield select(state => state.global.designerNotices.list);
        newList = oldList.concat(listData);
      } else {
        newList = listData;
      }
      pagination.current = page;
      yield put({
        type: 'saveDesignerNotices',
        payload: { list: newList, pagination, reload, noMore: listData.length < 6 },
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },

    *setNoticesRead({ payload, callback }, { call }) {
      const response = yield call(notocehasread, payload) || {};
      if (callback) callback(response);
    },
    *noticesCount({ payload }, { call, put }) {
      const response = yield call(noticesCount, payload) || {};
      if (!response) return;
      // if (callback) callback(response);
      yield put({
        type: 'saveNotifyCount',
        payload: response.data || 0,
      });
    },

    *designerNoticesCount({ payload }, { call, put }) {
      const response = yield call(noticesCount, payload) || {};
      if (!response) return;
      // if (callback) callback(response);
      const { type } = payload;
      yield put({
        type: 'saveDesignerNotifyCount',
        payload: { count: response.data || 0, type },
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },

    saveDesignerNotices(state, { payload }) {
      return {
        ...state,
        designerNotices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },

    saveNotifyCount(state, { payload }) {
      return {
        ...state,
        noticesCount: payload,
      };
    },

    saveDesignerNotifyCount(state, { payload }) {
      const { type, count } = payload;
      const typeCount = `${type}Count`;
      return {
        ...state,
        [typeCount]: count,
      };
    },
  },

  subscriptions: {
    // setup({ history }) {
    //   MtaH5.init(window.mtaConfig);
    //   return history.listen(() => {
    //     MtaH5.pgv();
    //   });
    // },
  },
};
