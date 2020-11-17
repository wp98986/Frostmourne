import React from 'react';
import classNames from 'classnames';
import { createFromIconfontCN } from '@ant-design/icons';
import styles from './index.less';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1992315_u94sttc770j.js',
});

export default props => {
  const { type, className } = props;
  return <IconFont className={classNames(styles.aliIcon, className)} type={type} />;
};
