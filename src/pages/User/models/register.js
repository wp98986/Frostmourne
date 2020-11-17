import { fakeRegister } from '@/services/api';
import { getCaptcha, forgetPwd } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },

    *queryVerCode({ payload, callback }, { call }) {
      const response = yield call(getCaptcha, payload);
      if (!response) return;
      if (callback) callback(response);
    },

    *forgetPwd({ payload, callback }, { call }) {
      const response = yield call(forgetPwd, payload);
      if (!response) return;
      if (callback) callback(response);
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
