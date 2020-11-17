import addLabelFunc from '@/utils/enumUtils';

const functionConstant = {
  functionDocTypeSite: {
    appShop: { label: '应用商城', key: 'appShop' },
    personal: { label: '个人设置', key: 'personal' },
    roleInfo: { label: '角色信息', key: 'roleInfo' },
    orgInfo: { label: '企业信息', key: 'orgInfo' },
    customer: { label: '客户管理', key: 'customer' },
    channel: { label: '渠道管理', key: 'channel' },
    store: { label: '门店管理', key: 'store' },
    design: { label: '方案列表', key: 'design' },
    goods: { label: '商品列表', key: 'goods' },
    order: { label: '客户订单', key: 'order' },
    purchase: { label: '采购订单', key: 'purchase' },
    estate: { label: '楼盘管理', key: 'estate' },
    notification: { label: '消息管理', key: 'notification' },
    Distribution: { label: '分销渠道', key: 'Distribution' },
    accountmanage: { label: '账户管理', key: 'accountmanage' },
    composition: { label: '方案管理', key: 'composition' },
    announcement: { label: '资讯管理', key: 'announcement' },
    websetup: { label: '站点设置', key: 'websetup' },
  },

  functionDocTypeBoss: {
    appShop: { label: '应用商城', key: 'appShop' },
    orgInfo: { label: '企业信息', key: 'orgInfo' },
    personal: { label: '个人设置', key: 'personal' },
    roleInfo: { label: '角色信息', key: 'roleInfo' },
    org: { label: '企业管理', key: 'org' },
    function: { label: '功能模块', key: 'function' },
    app: { label: '应用管理', key: 'app' },
    rol: { label: '角色管理', key: 'rol' },
    property: { label: '标签管理', key: 'property' },
    design: { label: '方案列表', key: 'design' },
    store: { label: '门店管理', key: 'store' },
    goods: { label: '商品列表', key: 'goods' },
    order: { label: '客户订单', key: 'order' },
    purchase: { label: '采购订单', key: 'purchase' },
    postsale: { label: '售后管理', key: 'postsale' },
    customer: { label: '客户管理', key: 'customer' },
    channel: { label: '渠道管理', key: 'channel' },
    homepage: { label: '首页管理', key: 'homepage' },
    protocol: { label: '企业协议', key: 'protocol' },
    propertybag: { label: '属性包管理', key: 'propertybag' },
    finance: { label: '财务管理', key: 'finance' },
    notification: { label: '消息管理', key: 'notification' },
    announcement: { label: '资讯管理', key: 'announcement' },
    website: { label: '站点管理', key: 'website' },
    urlconver: { label: '链接转换', key: 'urlconver' },
    // appversion: { label: '平板应用管理', key: 'appversion' },
    // system: { label: '系统管理', key: 'system' }
  },

  functionDocTypeSupplier: {
    personal: { label: '个人设置', key: 'personal' },
    roleInfo: { label: '角色信息', key: 'roleInfo' },
    orgInfo: { label: '企业信息', key: 'orgInfo' },
    store: { label: '门店管理', key: 'store' },
  },

  functionSite: {
    site: { label: '经销商', key: 'site' },
    boss: { label: '平台', key: 'boss' },
    supplier: { label: '供应商', key: 'supplier' },
  },
};
addLabelFunc(functionConstant);

export default functionConstant;
