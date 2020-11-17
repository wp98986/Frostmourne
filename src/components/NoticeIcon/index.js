import React, { PureComponent } from 'react';
import { BellOutlined } from '@ant-design/icons';
// import ReactDOM from 'react-dom';
import { Popover, Tabs, Badge, Spin } from 'antd';
import classNames from 'classnames';
import noticeSrcConstatnt from '@/constants/noticeSrcConstatnt';
import List from './NoticeList';
import styles from './index.less';

const { TabPane } = Tabs;

export default class NoticeIcon extends PureComponent {
  static Tab = TabPane;

  static defaultProps = {
    onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onClear: () => {},
    loading: false,
    clearClose: false,
    locale: {
      emptyText: 'No notifications',
      clear: 'Clear',
    },
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
    onViewMore: () => {},
  };

  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;
    const { clickClose } = item;
    onItemClick(item, tabProps);
    if (clickClose) {
      this.popover.click();
    }
  };

  onClear = name => {
    const { onClear } = this.props;
    onClear(name);
    // if (clearClose) {
    //   this.popover.click();
    // }
  };

  onTabChange = tabType => {
    const { onTabChange } = this.props;
    onTabChange(tabType);
  };

  onViewMore = (tabProps, event) => {
    const { onViewMore } = this.props;
    onViewMore(tabProps, event);
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
    const { setNoticeRead } = this.props;
    setNoticeRead(item);
  };

  getNotificationBox() {
    const { children, loading, locale, showViewMore } = this.props;
    if (!children) {
      return null;
    }
    // let defaultActiveKey;
    const panes = React.Children.map(children, child => {
      const { props: { name } = {} } = child;
      // if(list.length === 0) defaultActiveKey = child.props.name;
      const title =
        child.props.list && child.props.list.length > 0
          ? `${child.props.title} (${child.props.list.length})`
          : child.props.title;
      return (
        <TabPane tab={title} key={name}>
          <List
            {...child.props}
            data={child.props.list}
            onClick={item => this.onItemClick(item, child.props)}
            onClear={() => this.onClear(child.props.name)}
            title={child.props.title}
            locale={locale}
            onViewMore={event => this.onViewMore(child.props, event)}
            showViewMore={showViewMore}
            setNoticeRead={this.setNoticeRead}
          />
        </TabPane>
      );
    });
    return (
      <Spin spinning={loading} delay={0}>
        <Tabs className={styles.tabs} onChange={this.onTabChange}>
          {panes}
        </Tabs>
      </Spin>
    );
  }

  render() {
    const { className, count, popupAlign, popupVisible, onPopupVisibleChange, bell } = this.props;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const NoticeBellIcon = bell || <BellOutlined className={styles.icon} />;
    const trigger = (
      <span className={noticeButtonClass}>
        <Badge count={count} style={{ boxShadow: 'none' }} className={styles.badge}>
          {NoticeBellIcon}我的消息
        </Badge>
      </span>
    );
    if (!notificationBox) {
      return trigger;
    }
    const popoverProps = {};
    if ('popupVisible' in this.props) {
      popoverProps.visible = popupVisible;
    }
    return (
      <Popover
        placement="bottomRight"
        content={notificationBox}
        popupClassName={styles.popover}
        trigger="click"
        arrowPointAtCenter
        popupAlign={popupAlign}
        onVisibleChange={onPopupVisibleChange}
        {...popoverProps}
        // eslint-disable-line
        ref={node => {
          this.popover = node;
        }}
      >
        {trigger}
      </Popover>
    );
  }
}
