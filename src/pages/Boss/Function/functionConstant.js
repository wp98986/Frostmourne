import addLabelFunc from '@/utils/enumUtils';

const functionConstant = {
  functionDocTypeSite: {
    appShop: { label: '应用商城', key: 'appShop' },
    org: { label: '组织', key: 'org' },
    rol: { label: '角色', key: 'rol' },
  },

  functionDocTypeBoss: {
    app: { label: '应用管理', key: 'app' },
    function: { label: '功能模块', key: 'function' },
    org: { label: '组织', key: 'org' },
    rol: { label: '角色', key: 'rol' },
  },

  functionSite: {
    site: { label: '前端', key: 'site' },
    boss: { label: '后台', key: 'boss' },
  },
};
addLabelFunc(functionConstant);

export default functionConstant;
