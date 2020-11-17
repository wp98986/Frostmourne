import addLabelFunc from '@/utils/enumUtils';

const AppConstant = {
  typeEnum: {
    xshDesigner: { label: '新设荟设计师', key: 'xshDesigner' },
    xshPlat: { label: '新设荟平台', key: 'xshPlat' },
    xshCurator: { label: '新设荟馆长', key: 'xshCurator' },
    jointVenture: { label: '合资商', key: 'jointVenture' },
    franchisee: { label: '加盟商', key: 'franchisee' },
    brandLeague: { label: '品牌联盟', key: 'brandLeague' },
    decorateCompany: { label: '装饰公司', key: 'decorateCompany' },
    designer: { label: '独立设计师', key: 'designer' },
    promotioner: { label: '社会达人', key: 'promotioner' },
    businessSpace: { label: '商业空间', key: 'businessSpace' },
    basic: { label: '基础', key: 'basic' },
  },
};
addLabelFunc(AppConstant);

export default AppConstant;
