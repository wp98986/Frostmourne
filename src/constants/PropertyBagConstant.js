import addLabelFunc from '@/utils/enumUtils';

const propertyBagConstant = {
  valueTypeEnum: {
    input: { label: '输入框', key: 'input' },
    checkbox: { label: '多选', key: 'checkbox' },
    radio: { label: '单选', key: 'radio' },
  },
  typeEnum: {
    installService: { label: '安装服务', key: 'installService' },
    xshcommon: { label: '新设荟通用', key: 'xshcommon' },
    packagedMeal: { label: '整装套餐', key: 'packagedMeal' },
    customer: { label: '客户', key: 'customer' },
    common: { label: '通用', key: 'common' },
  },
};
addLabelFunc(propertyBagConstant);

export default propertyBagConstant;
