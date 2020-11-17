/* eslint-disable */
import Swiper from 'swiper/dist/js/swiper';
const defaultModal = function(container, pagination) {
  const swiperFun = new Swiper(container, {
    pagination: {
      el: pagination,
    },
    effect: 'cube',
  });
};

const modals = {
  defaultModal,
};

// export default modals;
module.exports = modals;
