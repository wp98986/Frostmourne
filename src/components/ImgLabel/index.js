import React, { Component } from 'react';
import { Button } from 'antd';
import uuidv1 from 'uuid/v1';
import EditImgLabel from './EditImgLabel';
import styles from './index.less';

class ImgLabel extends Component {
  static defaultProps = {
    containWidth: 1080,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
    this.moving = false;
    this.lastX = null;
    this.lastY = null;
  }

  del = toDeleteKey => {
    const {
      onChange,
      data: { details },
      containWidth,
    } = this.props;
    const newData = details.filter(d => d.uKey !== toDeleteKey);
    if (onChange) {
      onChange({ width: containWidth, details: newData });
    }
  };

  addLabel = toAddKey => {
    const {
      onChange,
      data: { details },
      containWidth,
    } = this.props;
    const newData = details.map(item => {
      if (item.uKey !== toAddKey) {
        return item;
      }
      const { labels = [], ...others } = item;
      const { width, height } = item;
      labels.push({
        pointX: width / 2,
        pointY: height / 2,
        direction: 'left',
        visible: true,
        uKey: uuidv1(),
        name: '',
      });
      return { ...others, labels };
    });
    if (onChange) {
      onChange({ width: containWidth, details: newData });
    }
  };

  handleImageLoaded = imgUkey => {
    const {
      onChange,
      data: { details },
      containWidth,
    } = this.props;
    const detail = details.find(d => d.uKey === imgUkey);
    const imgDom = document.getElementById(imgUkey);
    const { offsetWidth, offsetHeight } = imgDom;
    detail.width = offsetWidth;
    detail.height = offsetHeight;
    if (onChange) {
      onChange({ width: containWidth, details });
    }
  };

  labelChange(imgUkey, changedLabel) {
    const {
      onChange,
      data: { details },
      containWidth,
    } = this.props;
    const newData = details.map(img => {
      if (img.uKey !== imgUkey) {
        return img;
      }
      const { labels, ...others } = img;
      const newLabels = labels
        .map(l => {
          if (changedLabel.uKey === l.uKey) {
            return { ...l, ...changedLabel };
          }
          return l;
        })
        .filter(l => l.isDelete !== true);
      return { ...others, labels: newLabels };
    });
    if (onChange) {
      onChange({ width: containWidth, details: newData });
    }
  }

  render() {
    const {
      noEdit,
      data: { details = [] },
      containWidth,
      needPath,
      designPath,
      produtPath,
    } = this.props;
    const dataDom = details.map(item => {
      const { imgSrc, labels = [], uKey: imgUkey, width, height } = item;
      const labelsDom = labels.map(lItem => (
        <EditImgLabel
          border={{
            margin: 24,
            width,
            height,
          }}
          key={lItem.uKey}
          onChange={label => this.labelChange(imgUkey, label)}
          {...lItem}
          noEdit={noEdit}
          needPath={needPath}
          designPath={designPath}
          produtPath={produtPath}
        />
      ));
      return (
        <div key={imgSrc} className={styles.contain}>
          <div style={{ width: containWidth, position: 'relative' }} id={imgUkey}>
            <img
              src={imgSrc}
              alt="图片"
              draggable="false"
              style={{ width: containWidth }}
              onLoad={() => this.handleImageLoaded(imgUkey)}
            />
            {labelsDom}
          </div>
          {noEdit ? null : (
            <div className={styles.containBtn}>
              <Button type="primary" onClick={() => this.addLabel(imgUkey)}>
                添加标签
              </Button>
              <Button
                style={{ marginTop: 20 }}
                type="danger"
                ghost
                onClick={() => this.del(imgUkey)}
              >
                删除图片
              </Button>
            </div>
          )}
        </div>
      );
    });
    return <div>{dataDom}</div>;
  }
}

export default ImgLabel;
