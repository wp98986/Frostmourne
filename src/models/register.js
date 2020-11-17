import { register, sendMsg, joinorg } from '@/services/register';

export default {
  namespace: 'regist',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *register({ payload, callback }, { call }) {
      const response = yield call(register, payload);
      if (!response) return;
      callback(response);
    },
    *getCaptcha({ payload, callback }, { call }) {
      const response = yield call(sendMsg, payload);
      if (!response) return;
      callback(response);
    },
    *joinorg({ payload, callback }, { call }) {
      const response = yield call(joinorg, payload);
      if (!response) return;
      callback(response);
    },
  },

  reducers: {},
};
