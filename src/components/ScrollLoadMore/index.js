/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingOutlined, SmileOutlined } from '@ant-design/icons';

import styles from './index.less';

class ScrollLoadMore extends React.Component {
  render() {
    const { children = [], refresh, loadMore, dataLength, hasMore } = this.props;
    return (
      <div className={styles.scrollLoadMore}>
        <InfiniteScroll
          dataLength={dataLength}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className={styles.loading}>
              加载中
              <LoadingOutlined />
            </div>
          }
          endMessage={
            <div className={styles.noMore}>
              <SmileOutlined />
              没有更多了
            </div>
          }
          refreshFunction={refresh ? refresh : () => {}}
          pullDownToRefresh
          pullDownToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8595; 下拉刷新</h3>}
          releaseToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8593; 松开刷新</h3>}
        >
          {children}
        </InfiniteScroll>
      </div>
    );
  }
}

export default ScrollLoadMore;
