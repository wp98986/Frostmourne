import React from 'react';
import Zmage from 'react-zmage';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import styles from './index.less';
import ImgListSlider from '@/components/ImgListSliderPortrait';
// import nophoto from '@/assets/nophoto.jpg';

class ImgPreView extends React.Component {
  state = {};
  // constructor(props) {
  //   super(props);
  //   const { data: picUrls = [] } = props;
  //   this.state = {
  //     picUrls,
  //     imgSrc: picUrls[0],
  //   };
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data: picUrls = [] } = nextProps;
    this.setState({
      picUrls,
      imgSrc: picUrls[0],
      activeIndex: 0,
    });
  }

  imgClick = (imgSrc, index) => {
    this.setState({
      imgSrc,
      activeIndex: index,
    });
  };

  pathToVr = () => {
    const { vrUrl } = this.props;
    window.open(`//${vrUrl}`);
  };

  downloadIamge = (cdnUrl, imageName) => {
    const a = document.createElement('a'); // 生成一个a元素
    const event = new MouseEvent('click'); // 创建一个单击事件
    a.download = imageName || 'photo'; // 设置图片名称
    a.href = cdnUrl; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };

  render() {
    const { imgSrc = '', picUrls = [], activeIndex } = this.state;
    const { slidePreview } = this.props;
    // const picListNode = picUrls.map((item, index) => (
    //   <img
    //     className={activeIndex === index ? 'activeImgStyle' : 'defaultImgStyle'}
    //     key={item}
    //     src={item}
    //     onClick={() => {
    //       this.imgClick(item, index);
    //     }}
    //     alt=""
    //   />
    // ));
    const picListNode = picUrls.map(item => {
      const obj = { src: item };
      return obj;
    });
    const imgArr = [];
    for (let i = 0; i < picUrls.length; i += 1) {
      const item = picUrls[i];
      const imgObj = { src: item, alt: item };
      imgArr.push(imgObj);
    }
    // if (!imgSrc) imgSrc = picUrls[0] || '';
    const ind = imgSrc.lastIndexOf('/');
    const imgN = imgSrc.substring(ind + 1, imgSrc.length);
    const imgSplit = imgSrc.split('//');
    const cndUrl = `/cdn/${imgSplit[1]}`;
    return (
      <div className={styles.imgViewContainer}>
        <div className="imgViewBigImg">
          <Zmage
            className={styles.srcImg}
            src={imgSrc}
            set={imgArr}
            alt={imgSrc}
            backdrop="#fff"
            defaultPage={activeIndex}
          />
          <a className={styles.downloadIcon} onClick={() => this.downloadIamge(cndUrl, imgN)}>
            <VerticalAlignBottomOutlined style={{ color: '#fff' }} />
          </a>
        </div>
        <div className="imgViewImgList">
          <ImgListSlider
            slidePreview={slidePreview}
            activeIndex={activeIndex}
            activeClassName={styles.activeImgStyle}
            data={picListNode}
            imgClick={(item, index) => {
              this.imgClick(item.src, index);
            }}
          />
        </div>
      </div>
    );
  }
}

export default ImgPreView;
