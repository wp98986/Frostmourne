import {
  list,
  find,
  update,
  add,
  del,
  findProperty,
  updateProperty,
} from '@/services/propertyBagAPI';
import { select } from '@/services/org';

export default {
  namespace: 'propertybag',

  state: {
    list: [],
    view: {},
    orgs: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (!response) return;
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *fetchView({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      if (!response) return;
      yield put({
        type: 'saveView',
        payload: response,
      });
      if (callback) callback(response);
    },
    *findProperty({ payload, callback }, { call, put }) {
      const response = yield call(findProperty, payload);
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
    *updateProperty({ payload, callback }, { call }) {
      const response = yield call(updateProperty, payload);
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
    *fetchOrgs({ payload }, { put, call }) {
      const response = yield call(select, payload);
      if (!response) return;
      yield put({
        type: 'saveOrgs',
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
    saveOrgs(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        orgs: data,
      };
    },
  },
};
