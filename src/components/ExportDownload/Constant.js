import addLabelFunc from '@/utils/enumUtils';

const Constant = {
  statusEnum: {
    success: { label: '成功', key: 'success' },
    fail: { label: '失败', key: 'fail' },
    cancel: { label: '取消', key: 'cancel' },
    executing: { label: '执行中', key: 'executing' },
  },
};
addLabelFunc(Constant);

export default Constant;
