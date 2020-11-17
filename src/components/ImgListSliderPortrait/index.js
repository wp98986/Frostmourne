import React, { PureComponent } from 'react';
import classNames from 'classnames';
import ReactSwiper from '@/components/ReactSwiper';
import sliderLeft from '@/assets/sliderLeft.png';
import sliderRight from '@/assets/slideRight.png';

import styles from './index.less';

class ImgListSlider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  changeIndex = (item, index) => {
    const { imgClick } = this.props;
    this.setState({
      activeIndex: index,
    });
    if (typeof imgClick === 'function') imgClick(item, index);
  };

  render() {
    const { activeIndex: stateActiveIndex } = this.state;
    const {
      data = [],
      slidePreview = 3,
      activeClassName,
      activeIndex = stateActiveIndex,
    } = this.props;
    const imgList = data.map((item, index) => {
      const { src } = item;
      const key = index;
      return (
        <div className="swiper-slide" key={key}>
          <div className={classNames('img-box', index === activeIndex ? activeClassName : null)}>
            <img
              alt=""
              src={src}
              onClick={() => {
                this.changeIndex(item, index);
              }}
            />
          </div>
        </div>
      );
    });
    const needNav = data.length > slidePreview;
    const swiperOptions = {
      direction: 'horizontal',
      slidesPerView: slidePreview,
      slidesPerGroup: slidePreview,
      mousewheel: false,
    };
    return (
      <div className={styles.slider}>
        <div id="certify" className={styles.sliderBody}>
          {needNav ? (
            <img
              className={classNames(styles.pageBtn, 'swiperButton')}
              src={sliderLeft}
              onClick={() => {
                this.swiper.prev();
              }}
              alt=""
            />
          ) : null}
          <ReactSwiper
            ref={self => {
              this.swiper = self;
            }}
            swiperOptions={swiperOptions}
          >
            {imgList}
          </ReactSwiper>
          {needNav ? (
            <img
              className={classNames(styles.pageBtn, 'swiperButton')}
              onClick={() => {
                this.swiper.next();
              }}
              src={sliderRight}
              alt=""
            />
          ) : null}
        </div>
      </div>
    );
  }
}
export default ImgListSlider;
