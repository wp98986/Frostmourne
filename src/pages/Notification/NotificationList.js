import React from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Card, List, Pagination } from 'antd';
import classNames from 'classnames';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import noticeSrcConstatnt from '@/constants/noticeSrcConstatnt';

import NoticeConstant from './NoticeConstant';
import styles from './Notification.less';

const { statusEnum, typeEnum } = NoticeConstant;

@connect(({ global, loading }) => ({
  notices: global.notices,
  loading: loading.effects['global/fetchNotices'] || false,
}))
class NotificationList extends React.Component {
  componentDidMount() {
    this.queryNoticeList(1);
  }

  pageChange = page => {
    this.queryNoticeList(page);
  };

  setNoticeRead = (item, e) => {
    const { srcType, srcId, link } = item;
    const srcObj = noticeSrcConstatnt[APP_TYPE][srcType] || {};
    if (!srcType && link) {
      window.open(link);
    }
    if (srcType) {
      if (srcObj.key) {
        const url = `${srcObj.key}${srcId}`;
        window.open(url);
      }
    }
    e.preventDefault();
  };

  queryNoticeList(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchNotices',
      payload: { page, pageSize: 10 },
    });
  }

  render() {
    const {
      notices: { list = [], pagination = {} },
      loading,
    } = this.props;
    const ListContent = ({ data: { type, status, title, content, createdate } }) => (
      <div className={styles.listContent}>
        <div className={classNames(styles.listContentItem, styles.noticeItemType)}>
          <span>消息类型</span>
          <p>{typeEnum.getLabel(type)}</p>
        </div>
        <div className={classNames(styles.listContentItem, styles.noticeItemStatus)}>
          <span>状态</span>
          <p>{statusEnum.getLabel(status)}</p>
        </div>
        <div className={classNames(styles.listContentItem, styles.noticeItemTitle)}>
          <span>标题</span>
          <p>{title}</p>
        </div>

        <div className={classNames(styles.listContentItem, styles.noticeItemContent)}>
          <span>消息内容</span>
          <p>{content}</p>
        </div>
        <div className={classNames(styles.listContentItem, styles.noticeItemDate)}>
          <span>创建时间</span>
          <p>{moment(createdate).format('YYYY-MM-DD hh:MM:ss')}</p>
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper title="消息列表">
        <div className={styles.standardList}>
          <Card className={styles.card} bordered={false}>
            <div className={styles.tableList}>
              <Card
                className={styles.listCard}
                bordered={false}
                bodyStyle={{ padding: '0 32px 40px 32px' }}
              >
                <List
                  size="large"
                  rowKey="id"
                  loading={loading}
                  dataSource={list}
                  renderItem={item => (
                    <List.Item actions={[<a onClick={e => this.setNoticeRead(item, e)}>去处理</a>]}>
                      <ListContent data={item} />
                    </List.Item>
                  )}
                />
              </Card>
            </div>
            <div className={styles.noticePaination}>
              <Pagination
                showTotal={total => `共 ${total} 条数据`}
                current={pagination.current}
                defaultPageSize={pagination.pageSize}
                total={pagination.total}
                onChange={this.pageChange}
              />
            </div>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default NotificationList;
