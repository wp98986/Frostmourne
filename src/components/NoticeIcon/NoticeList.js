import React from 'react';
import { List, Button } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';

export default function NoticeList({
  data = [],
  onClick,
  onClear,
  title,
  locale,
  emptyText,
  emptyImage,
  onViewMore = null,
  showClear = true,
  showViewMore = false,
  setNoticeRead = () => {},
}) {
  // console.log(data)
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          // const leftIcon = item.avatar ? (
          //   typeof item.avatar === 'string' ? (
          //     <Avatar className={styles.avatar} src={item.avatar} />
          //   ) : (
          //     item.avatar
          //   )
          // ) : null;

          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                // avatar={<span className={styles.iconElement}>{leftIcon}</span>}
                // title={
                //   <div className={styles.title}>
                //     {item.title}
                //     <div className={styles.extra}>{item.extra}</div>
                //   </div>
                // }
                description={
                  <div className={styles.descriptionItem}>
                    <div>
                      <div className={styles.description} title={item.description}>
                        {item.title}
                      </div>
                      <div className={styles.datetime}>{item.datetime}</div>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      // href={item.link}
                      // target="_blank"
                      onClick={e => {
                        setNoticeRead(item, e);
                      }}
                    >
                      去查看
                    </Button>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {locale.clear} {title}
          </div>
        ) : null}
        {showViewMore ? <div onClick={onViewMore}>{locale.viewMore}</div> : null}
      </div>
    </div>
  );
}
