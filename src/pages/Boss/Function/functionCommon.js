import functionConstant from '@/constants/functionConstant';

const { functionDocTypeSite, functionDocTypeBoss } = functionConstant;

export default function getFunctionDocType(site) {
  return site === 'boss' ? functionDocTypeBoss : functionDocTypeSite;
}
