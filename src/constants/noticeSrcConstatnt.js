import addLabelFunc from '@/utils/enumUtils';

const noticeSrcConstatnt = {
  boss: {
    order: { label: '客户订单', key: '//site.pei.nature-home.cn/order/customer/view/' },
    announcement: { label: '资讯', key: '//pei.nature-home.cn/information/view/' },
    purchaseOrder: { label: '采购订单', key: '//boss.nature-home.cn/order/purchase/view/' },
  },
  site: {
    order: { label: '客户订单', key: '//site.pei.nature-home.cn/order/customer/view/' },
    announcement: { label: '资讯', key: '//pei.nature-home.cn/information/view/' },
    purchaseOrder: { label: '采购订单', key: '//site.pei.nature-home.cn/purchase/purchase/view/' },
  },
};
addLabelFunc(noticeSrcConstatnt);

export default noticeSrcConstatnt;
