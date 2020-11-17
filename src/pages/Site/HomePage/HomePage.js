import React from 'react';
import { Spin } from 'antd';

import styles from './HomePage.less';

class HomePage extends React.Component {
  state = {};

  componentDidMount() {
    console.log(23333);
  }

  render() {
    return (
      <div className={styles.homepageContainer}>
        <Spin>dddd</Spin>
      </div>
    );
  }
}

export default HomePage;
