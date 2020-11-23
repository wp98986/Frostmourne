import React, { Component } from 'react';
import { connect } from 'umi';
import { Row, Col } from 'antd';
import ChangePhoneNoModal from './ChangePhoneNoModal';
import DealPwdModal from './DealPwdModal';
import styles from './OrgInfo.less';

@connect(({ user }) => {
  const { currentUser: { data } = {} } = user;
  return {
    currentUser: data,
  };
})
class DealPwd extends Component {
  reloadUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  };

  openChangeMobile = () => {
    this.changePhone.openModal();
  };

  openDealPwdModal = () => {
    const { currentUser } = this.props;
    this.dealPwd.openModal(currentUser);
  };

  render() {
    const { currentUser: { org: { mobile: orgMobile, pwdMflag } = {} } = {} } = this.props;

    return (
      <div>
        <Row type="flex" className={styles.dealPwdContainer}>
          <div>绑定手机：</div>
          <Col span={3}>{orgMobile}</Col>
          <a onClick={this.openChangeMobile}>更换手机</a>
        </Row>
        <Row type="flex" className={styles.dealPwdContainer}>
          <div>交易密码：</div>
          <Col span={3}>{pwdMflag ? '已设置' : '未设置'}</Col>
          <a onClick={this.openDealPwdModal}>{pwdMflag ? '更改' : '去设置'}</a>
        </Row>

        <ChangePhoneNoModal
          wrappedComponentRef={refs => {
            this.changePhone = refs;
          }}
        />
        <DealPwdModal
          wrappedComponentRef={refs => {
            this.dealPwd = refs;
          }}
          reloadData={this.reloadUser}
        />
      </div>
    );
  }
}

export default DealPwd;
