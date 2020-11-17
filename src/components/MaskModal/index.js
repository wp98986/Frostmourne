import React, { Component } from 'react';
import { Modal } from 'antd';
import styles from './index.less';

class MaskModal extends Component {
  componentDidMount() {}

  render() {
    const { children } = this.props;
    return (
      <Modal className={styles.container} footer={null} {...this.props}>
        {children}
      </Modal>
    );
  }
}

export default MaskModal;
