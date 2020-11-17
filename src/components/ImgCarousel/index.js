import React, { PureComponent } from 'react';
import Zmage from 'react-zmage';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import isEqual from 'lodash/isEqual';
import styles from './index.css';
import nophoto from '@/assets/nophoto.jpg';

export default class ImgCarousel extends PureComponent {
  state = {
    picList: [],
    imgSrc: '',
    currentPage: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      picList: props.data || [],
      index: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const { data } = nextProps;
    if (isEqual(data, preState.data)) {
      return null;
    }
    return {
      picList: data || [],
    };
  }

  imgClick = (imgSrc, currentPage) => {
    this.setState({
      imgSrc,
      currentPage,
    });
  };

  nextClick = () => {
    let { index } = this.state;
    const { picList } = this.state;
    index += 1;
    if (picList.length - 3 === index) {
      return;
    }
    const component = this.scrollDiv;
    component.scrollTo(index * 194, 0);
    this.setState({
      index,
    });
  };

  prevClick = () => {
    let { index } = this.state;
    index -= 1;
    if (index < 0) {
      return;
    }
    const component = this.scrollDiv;
    component.scrollTo(index * 194, 0);
    this.setState({
      index,
    });
  };

  render() {
    const { picList, currentPage } = this.state;
    let { imgSrc } = this.state;
    if (!imgSrc) imgSrc = picList[0] || '';
    const width = picList.length * 206;
    const imgArr = [];
    for (let i = 0; i < picList.length; i += 1) {
      const item = picList[i];
      const imgObj = { src: item, alt: item };
      imgArr.push(imgObj);
    }
    const imgList = picList.map((item, index) => (
      <img
        onClick={() => {
          this.imgClick(item, index);
        }}
        key={item}
        className={styles.imgCarousel}
        src={item}
        alt=""
      />
    ));
    return (
      <div>
        <div className={styles.srcImgBox}>
          <Zmage
            className={styles.srcImg}
            src={imgSrc || nophoto}
            set={imgArr}
            alt={imgSrc}
            backdrop="#fff"
            defaultPage={currentPage}
          />
        </div>
        <div className={styles.imgBtnBox}>
          <div className={styles.prevBtn} onClick={() => this.prevClick()}>
            <LeftOutlined />
          </div>
          <div
            className={styles.imgCarouselBox}
            ref={c => {
              this.scrollDiv = c;
            }}
          >
            <div style={{ width: `${width}px` }}>{imgList}</div>
          </div>
          <div className={styles.nextBtn} onClick={() => this.nextClick()}>
            <RightOutlined />
          </div>
        </div>
      </div>
    );
  }
}
