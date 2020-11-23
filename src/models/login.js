// import { routerRedux } from 'dva/router';
import { history } from 'umi';
// import { stringify } from 'qs';
import { login, sendMsg } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      // if (response.success) {
      //   reloadAuthorized();
      //   const urlParams = new URL(window.location.href);
      //   const params = getPageQuery();
      //   let { redirect } = params;
      //   if (redirect) {
      //     const redirectUrlParams = new URL(redirect);
      //     if (redirectUrlParams.origin === urlParams.origin) {
      //       redirect = redirect.substr(urlParams.origin.length);
      //       if (redirect.startsWith('/#')) {
      //         redirect = redirect.substr(2);
      //       }
      //     } else {
      //       window.location.href = redirect;
      //       return;
      //     }
      //   }
      //   yield put(routerRedux.replace(redirect || '/'));
      // }
      callback(response);
    },

    *getCaptcha({ payload }, { call }) {
      yield call(sendMsg, payload);
    },

    *logout({ payload: { fresh = false } = {} }, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      document.cookie = 'token=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      if (fresh) {
        window.location.reload();
      } else {
        history.push('/user/login');
        // yield put(
        //   routerRedux.push({
        //     pathname: '/user/login',
        //     search: stringify({
        //       redirect: window.location.href,
        //     }),
        //   })
        // );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
