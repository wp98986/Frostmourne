import React, { PureComponent } from 'react';
import Swiper from 'swiper';
import isEqual from 'lodash/isEqual';

class ReactSwiper extends PureComponent {
  constructor(props) {
    super(props);
    this.currentSwiper = null;
  }

  componentDidMount() {
    this.reloadSwiper();
  }

  componentDidUpdate(prevProps) {
    const { children = [], swiperOptions } = this.props;
    const { children: oldChildren = [], swiperOptions: oldSwiperOptions } = prevProps;
    let shouldUpdateSwipeInstance = !isEqual(oldSwiperOptions, swiperOptions);
    shouldUpdateSwipeInstance = shouldUpdateSwipeInstance || children.length !== oldChildren.length;

    if (shouldUpdateSwipeInstance) {
      this.reloadSwiper();
    }
  }

  clearSwiper() {
    this.currentSwiper.destroy();
    this.currentSwiper = null;
  }

  reloadSwiper() {
    if (this.currentSwiper) {
      this.clearSwiper();
    }
    const {
      swiperOptions: { activeIndex = 0, direction = 'vertical', ...otherOptions } = {},
    } = this.props;
    const slider = new Swiper(this.containerEl, {
      direction,
      initialSlide: activeIndex,
      ...otherOptions,
    });
    this.currentSwiper = slider;
  }

  next() {
    this.currentSwiper.slideNext();
  }

  prev() {
    this.currentSwiper.slidePrev();
  }

  render() {
    const { className = '', children } = this.props;
    // if (this.currentSwiper) console.info(this.currentSwiper.clickedIndex);
    return (
      <div
        ref={el => {
          this.containerEl = el;
        }}
        className={`swiper-container ${className}`}
      >
        <div className="swiper-wrapper">{children}</div>
      </div>
    );
  }
}
export default ReactSwiper;
