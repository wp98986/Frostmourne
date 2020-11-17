import React from 'react';

import styles from './index.less';

class Footer extends React.PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.container}>
        {
          // <div className={styles.footer}>
          //   <div className={styles.footerItem}>
          //     <span className={styles.footerIcon1} />
          //     <p>7天无理由售后服务</p>
          //   </div>
          //   <div className={styles.footerItem}>
          //     <span className={styles.footerIcon2} />
          //     <p>城市上门安装配送</p>
          //   </div>
          //   <div className={styles.footerItem}>
          //     <span className={styles.footerIcon3} />
          //     <p>一对一提供家装解决方案</p>
          //   </div>
          //   <div className={styles.footerItem}>
          //     <span className={styles.footerIcon4} />
          //     <p>免费3D效果设计出图</p>
          //   </div>
          //   <div className={styles.footerItem}>
          //     <span className={styles.footerIcon5} />
          //     <p>线下体验店真实体验</p>
          //   </div>
          //   <div className={styles.footerItem}>
          //     <span className={styles.footerIcon6} />
          //     <p>5万平米仓库管理</p>
          //   </div>
          // </div>
        }
        <div className={styles.footer}>
          <img src="/pei_bottom.png" alt="" />
        </div>
      </div>
    );
  }
}

export default Footer;
