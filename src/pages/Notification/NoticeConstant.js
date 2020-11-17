import addLabelFunc from '@/utils/enumUtils';

const NoticeConstant = {
  typeEnum: {
    notification: { label: '通知', key: 'notification' },
    orderMessage: { label: '消息', key: 'orderMessage' },
  },
  statusEnum: {
    hasRead: { label: '已读', key: 'hasRead' },
    unRead: { label: '未读', key: 'unRead' },
  },
};
addLabelFunc(NoticeConstant);

export default NoticeConstant;
