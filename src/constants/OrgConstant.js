import addLabelFunc from '@/utils/enumUtils';

const orgConstant = {
  statusEnum: {
    auditing: { label: '待审核', key: 'auditing' },
    comfirm: { label: '已审核', key: 'comfirm' },
    unComfirm: { label: '审核失败', key: 'unComfirm' },
  },

  orgTypeEnum: {
    headquarters: { label: '总部', key: 'headquarters' },
    distributor: { label: '经销商', key: 'distributor' },
  },

  siteOrgTypeEnum: {
    jointVenture: { label: '合资商', key: 'jointVenture' },
    franchisee: { label: '加盟商', key: 'franchisee' },
    brandLeague: { label: '品牌联盟', key: 'brandLeague' },
    decorateCompany: { label: '装饰公司', key: 'decorateCompany' },
    designer: { label: '独立设计师', key: 'designer' },
    promotioner: { label: '社会达人', key: 'promotioner' },
    businessSpace: { label: '商业空间', key: 'businessSpace' },
  },

  businessTypeEnum: {
    'SB-Purchase': { label: 'S2B采购模式', key: 'SB-Purchase' },
    'SC-Purchase': { label: 'S2C采购模式', key: 'SC-Purchase' },
    'SB-Discounter': { label: 'S2B让利模式', key: 'SB-Discounter' },
    'SC-Rebate': { label: 'S2C返利模式', key: 'SC-Rebate' },
  },
};
addLabelFunc(orgConstant);

export default orgConstant;
