// import MergeLessPlugin from 'antd-pro-merge-less';
// import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import path from 'path';
import moment from 'moment';

const appType = process.env.APP_TYPE;
const timeStamp = process.env.npm_config_timestamp;
const now = timeStamp || moment().format('YYYYMMDDHHmm');
export default config => {
  // 临时关闭切换主题的插件功能，否则less热更新会很慢
  // 将所有 less 合并为一个供 themePlugin使用
  // const outFile = path.join(__dirname, '../.temp/ant-design-pro.less');
  // const stylesDir = path.join(__dirname, '../src/');
  // config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
  //   {
  //     antDir: path.join(__dirname, '../node_modules/antd'),
  //     stylesDir,
  //     varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
  //     mainLessFile: outFile, //     themeVariables: ['@primary-color'],
  //     indexFileName: 'index.html',
  //     lessUrl: '',
  //   },
  // ]);

  config.plugin('zip').use(ZipPlugin, [
    {
      path: path.join(__dirname, '../zip'),
      filename: `${appType}${now}.zip`,
    },
  ]);
};
