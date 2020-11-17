/* eslint-disable */
import React, { PureComponent } from 'react';
import Swiper from 'swiper/dist/js/swiper';
import { defaultModal } from './SwiperModals';

import 'swiper/dist/css/swiper.min.css';

class SwiperTest extends PureComponent {
  componentDidMount() {
    defaultModal(this.swiperID, this.paginateID);
  }

  render() {
    return (
      <div className="wxchat-banner">
        <section
          className="new_custom swiper-container index_tab_con"
          ref={self => (this.swiperID = self)}
        >
          <ul className="swiper-wrapper">
            <div className="swiper-slide">
              <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556267696256&di=0ba88a8e5cc2e104eefdab100ef0027c&imgtype=0&src=http%3A%2F%2Fp0.qhimgs4.com%2Ft01969e361e6bda3a60.jpg"
                alt=""
              />
            </div>
            <div className="swiper-slide">
              <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556267696256&di=0ba88a8e5cc2e104eefdab100ef0027c&imgtype=0&src=http%3A%2F%2Fp0.qhimgs4.com%2Ft01969e361e6bda3a60.jpg"
                alt=""
              />
            </div>
          </ul>
          <div
            className="swiper-pagination banner-pagination"
            ref={self => (this.paginateID = self)}
          />
        </section>
      </div>
    );
  }
}
export default SwiperTest;
