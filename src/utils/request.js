import fetch from 'dva/fetch';
import { notification } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';

/* eslint-disable*/

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户登陆失败。',
  402: '用户没有登录。',
  403: '没有得到授权',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const notifyErrorMessage = (response, code, message) => {
  const { url, statusText, status } = response;
  const calStatus = code || status;
  const urlObj = new URL(url);
  const errortext = message || codeMessage[calStatus] || statusText;
  notification.error({
    message: `请求错误 ${calStatus}`,
    description: (
      <div>
        <div>{errortext}</div>
      </div>
    ),
  });
  const error = new Error(errortext);
  error.name = calStatus;
  error.response = response;
  return error;
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status >= 500) {
    throw notifyErrorMessage(response, response.status);
  } else {
    return response
      .clone()
      .json()
      .then(content => {
        const { errorCode: httpCode, errorMessage, data } = content;
        let message = errorMessage;
        if (httpCode && httpCode >= 400) {
          if (httpCode === '403') {
            // data为权限名称
            message = `${message}:${data}`;
          }
          if (httpCode === '401') {
            router.push('/user');
            return;
          }
          throw notifyErrorMessage(response, httpCode, message);
        }
        return response;
      });
  }
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

const addURLParam = (url, key, value) => {
  let newUrl = '';
  const reg = new RegExp(`'(^|)'${key}'=([^&]*)(|$)'`);
  const newParam = encodeURI(`${key}=${value}`);
  if (url.match(reg) != null) {
    /* eslint-disable no-eval */
    newUrl = url.replace(eval(reg), newParam);
    /* eslint-enable no-eval */
  } else if (url.match('[?]')) {
    newUrl = `${url}&${newParam}`;
  } else {
    newUrl = `${url}?${newParam}`;
  }

  return newUrl;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: isAntdPro(),
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const { code, name, message, response: { status } = {} } = e;
      if (code === 20) {
        console.info(e);
      }
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // // environment should not be used
      // if (status === 401) {
      //   notification.error({
      //     message: `登陆失败`,
      //   });
      //   // router.push('/exception/403');
      //   return;
      // }
      // if (status === 402) {
      //   notification.error({
      //     message: `未登录`,
      //   });
      //   // router.push('/exception/403');
      //   return;
      // }
      // if (status === 403) {
      //   notification.error({
      //     message: `没有权限`,
      //   });
      //   // router.push('/exception/403');
      //   return;
      // }
      // if (status === 404) {
      //   notification.error({
      //     message: `请求不存在`,
      //   });
      //   // router.push('/exception/403');
      //   return;
      // }
      // if (status === 409) {
      //   notification.error({
      //     message: `请求失败`,
      //   });
      //   // router.push('/exception/403');
      //   return;
      // }
      // if (status === 500) {
      //   notification.error({
      //     message: `请求异常`,
      //   });
      //   return;
      // }
      if (status >= 404 && status < 422) {
        // router.push('/exception/404');
      }
    });
}

export function getPrefix() {
  if (APP_TYPE) {
    if (APP_TYPE == 'frontsite' || APP_TYPE == 'designer') {
      return `/site`;
    } else return `/${APP_TYPE}`;
  }
  return '';
}

function getUrlWithPrefix(url) {
  let newUrl = url;
  if (!url.startsWith('/')) newUrl = `/${url}`; //如果 url不是‘/’开通，补齐
  return `${getPrefix()}${newUrl}`;
}

export function getWithPrefix(url, params, options) {
  return get(getUrlWithPrefix(url), params, options);
}

export function postWithPrefix(url, form, options) {
  return post(getUrlWithPrefix(url), form, options);
}

// eg:  get('/polarbear/agcy/staff/staff',{"name":"roy"})
export function get(url, params, options) {
  const newOptions = { expirys: false, method: 'GET', ...options };
  let newUrl = url;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      newUrl = addURLParam(newUrl, key, value);
    });
  }
  return request(newUrl, newOptions);
}

/*
  eg:  
  const formData = new FormData();
  formData.append('queryParam', queryParamStr);
  return post('/polarbear/agcy/login', formData);
  */
export function post(url, form, options) {
  const newOptions = { expirys: false, method: 'POST', ...options };
  newOptions.body = form;
  return request(url, newOptions);
}
