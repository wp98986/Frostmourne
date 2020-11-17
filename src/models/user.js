import {
  query as queryUsers,
  queryCurrent,
  savePersonalInfo,
  queryChangeList,
  change,
  updatePart,
  joinOrg,
  modPwd,
  getCaptcha,
  setPwd,
  invitePerson,
  verificateStr,
  settradepassword,
} from '@/services/user';
import { addOrg } from '@/services/org';
import router from 'umi/router';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    changeList: [],
    inviteMobile: '',
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({ callback }, { call, put }) {
      const response = yield call(queryCurrent);
      if (!response) {
        router.push(`/user/login`);
        return;
      }
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchChangeList({ payload }, { call, put }) {
      const response = yield call(queryChangeList, payload);
      yield put({
        type: 'saveChangeList',
        payload: response,
      });
    },
    *change({ payload, callback }, { call }) {
      const response = yield call(change, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *savePersonalInfo({ payload, callback }, { call }) {
      const response = yield call(savePersonalInfo, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *addOrg({ payload, callback }, { call }) {
      const response = yield call(addOrg, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *joinOrg({ payload, callback }, { call }) {
      const response = yield call(joinOrg, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *modpass({ payload, callback }, { call }) {
      const response = yield call(modPwd, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *updatePart({ payload, callback }, { call }) {
      const response = yield call(updatePart, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *getCaptcha({ payload, callback }, { call }) {
      const response = yield call(getCaptcha, payload);
      if (callback) callback(response);
    },
    *setPwd({ payload, callback }, { call }) {
      const response = yield call(setPwd, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *invitePerson({ payload, callback }, { call }) {
      const response = yield call(invitePerson, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *verificateStr({ payload, callback }, { call }) {
      const response = yield call(verificateStr, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *setTradePwd({ payload, callback }, { call }) {
      const response = yield call(settradepassword, payload);
      if (!response) return;
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveChangeList(state, action) {
      return {
        ...state,
        changeList: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    changeInviteMobile(mobile) {
      return {
        inviteMobile: mobile,
      };
    },
  },
};
