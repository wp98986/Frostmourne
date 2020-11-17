import React, { Component } from 'react';

import styles from './index.less';

class BacktoTop extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.backtotop}>
        <span>返回顶部</span>
      </div>
    );
  }
}

export default BacktoTop;
