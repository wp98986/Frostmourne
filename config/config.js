// https://umijs.org/config/
import { utils } from 'umi';
import path from 'path';
import bossRoutes from './boss.router';
import siteRoutes from './site.router';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const { winPath } = utils;

// const plugins = [
//   [
//     'umi-plugin-react',
//     {
//       antd: true,
//       dva: {
//         hmr: true,
//       },
//       locale: {
//         enable: true, // default false
//         default: 'zh-CN', // default zh-CN
//         baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
//       },
//       dynamicImport: {
//         webpackChunkName: true,
//         loadingComponent: './components/PageLoading/index',
//       },
//       ...(!process.env.TEST
//         ? {
//             dll: {
//               include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
//               exclude: ['@babel/runtime'],
//             },
//             // hardSource: true,
//           }
//         : {}),
//     },
//   ],
// ];

const routesMap = {
  site: siteRoutes,
  boss: bossRoutes,
};

const pageRoutes = routesMap[process.env.APP_TYPE] ? routesMap[process.env.APP_TYPE] : siteRoutes;

const defaultJs = ['/js-extend.js', '/js-pinyin.js', '/qrcode.js', '/jquery-1.8.1.min.js'];
const defaultCss = ['/jigsaw.css'];

const contextMap = {
  boss: {
    title: '优品配',
    favicon: '/favicon.png',
  },
  site: {
    title: '优品配',
    favicon: '/favicon.png',
    // meiqia: { js: '/meiqia.js' },
  },
  // frontsite: {
  //   title: '优品配',
  //   favicon: '/favicon.png',
  //   externalJs: [...defaultJs, '/slick/slick.min.js'],
  //   externalCss: [...defaultCss, '/slick/slick.min.css', '/slick/slick-theme.min.css'],
  //   mta: { sid: '500675083', autoReport: 0 },
  // },
  // supplier: { title: '优品配', favicon: '/favicon.png' },
  // designer: {
  //   title: '新设荟',
  //   favicon: '/favicon_xsh.png',
  //   mta: { sid: '500686273', autoReport: 0, cid: '500691300' },
  //   meiqia: { js: '/meiqia.js' },
  // },
};

const title = contextMap[process.env.APP_TYPE].title;
const favicon = contextMap[process.env.APP_TYPE].favicon;
// const mta = contextMap[process.env.APP_TYPE].mta;
// const meiqia = contextMap[process.env.APP_TYPE].meiqia;
const isDev = process.env.NODE_ENV === 'development';
const devtool = isDev ? 'cheap-module-eval-source-map' : 'source-map';
const externalJs = contextMap[process.env.APP_TYPE].externalJs || defaultJs;
const externalCss = contextMap[process.env.APP_TYPE].externalCss || defaultCss;
export default {
  // add for transfer to umi
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // enable: true, // default false
    default: 'zh-CN', // default zh-CN
    baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
  },
  dynamicImport: {
    // webpackChunkName: true,
    loading: '@/components/PageLoading/index',
  },
  // ...(!process.env.TEST
  //   ? {
  //       dll: {
  //         include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
  //         exclude: ['@babel/runtime'],
  //       },
  //       // hardSource: true,
  //     }
  //   : {}),
  targets: {
    ie: 9,
  },
  hash: true,
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    CODE_EV: process.env.CODE_EV || '',
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    // 'fixed-header': defaultSettings.fixedHeader,
    // fixedHeader: defaultSettings.fixedHeader,
  },
  externals: {
    // '@antv/data-set': 'DataSet',
    js: externalJs,
    css: externalCss,
    // mta,
    // meiqia,
  },
  title,
  favicon,
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  // disableRedirectHoist: true,
  cssLoader: {
    modules: {
      getLocalIdent: (context, _, localName) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map(a => a.replace(/([A-Z])/g, '-$1'))
            .map(a => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    },
  },
  manifest: {
    basePath: '/',
  },
  // ...(!isDev ? { chainWebpack: webpackPlugin } : {}),
  chainWebpack: webpackPlugin,
  extraBabelPlugins: ['arithmetic'],
  devtool,
  alias: {
    '@config': path.join(__dirname, './'),
  },
  cssnano: {
    mergeRules: false,
  },

  proxy: {
    '/site': {
      target: 'http://site.pei.nature-home.cn',
      changeOrigin: true,
      cookieDomainRewrite: 'localhost',
    },
    '/boss': {
      target: 'http://boss.nature-home.cn',
      changeOrigin: true,
      cookieDomainRewrite: 'localhost',
    },
  },
};
