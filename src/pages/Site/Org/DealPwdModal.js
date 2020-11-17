import React from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Button, Input, Modal, message } from 'antd';

import styles from './OrgInfo.less';

const FormItem = Form.Item;
// const RadioGroup = Radio.Group;

@connect(({ loading }) => {
  const pwdloading = loading.effects['orgInfo/updatePwd'];
  return {
    pwdloading,
  };
})
@Form.create()
class DealPwdModal extends React.Component {
  state = {};

  openModal = currentUser => {
    this.setState({
      modalVisible: true,
      currentUser,
    });
  };

  handleCancelModal = () => {
    clearInterval(this.interval);
    this.setState({
      modalVisible: false,
      secondsCount: 0,
    });
  };

  timeFun = () => {
    let count = 60;
    this.interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(this.interval);
      }
      this.setState({
        secondsCount: count,
      });
    }, 1000);
  };

  getVerCode = () => {
    // 获取验证码
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfo/sendVerCode',
      payload: {},
    });
    this.timeFun();
  };

  submitHandle = e => {
    e.preventDefault();
    const { form, dispatch, reloadData } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'orgInfo/updatePwd',
        payload: { ...fieldsValue },
        callback: res => {
          const {
            data: { code, message: returnMessage },
          } = res;
          if (code === '203') {
            message.success('设置成功！');
            this.handleCancelModal();
            if (reloadData) reloadData();
          } else {
            Modal.error({
              title: '错误',
              content: returnMessage,
            });
          }
        },
      });
    });
  };

  render() {
    const { modalVisible, secondsCount, currentUser: { org: { pwdMflag } = {} } = {} } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      pwdloading,
    } = this.props;
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    const newPwd = getFieldValue('newPassword');
    const validatorPwd = (rule, value, callback) => {
      if (value) {
        if (value !== newPwd) {
          callback('两次输入密码不同');
        } else {
          callback();
        }
      }
      callback();
    };
    return (
      <Modal
        title="设置交易密码"
        className={styles.standardListForm}
        width={640}
        // bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
        destroyOnClose
        visible={modalVisible}
        okText="保存"
        onOk={this.submitHandle}
        onCancel={this.handleCancelModal}
        confirmLoading={pwdloading}
      >
        <Form>
          {pwdMflag ? (
            <FormItem label="旧交易密码" {...formLayout}>
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    message: '请输入旧的交易密码',
                  },
                ],
              })(
                <Input type="password" autoComplete="new-password" placeholder="请输入旧交易密码" />
              )}
            </FormItem>
          ) : null}
          <FormItem label="新交易密码" {...formLayout}>
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入新的交易密码',
                },
              ],
            })(<Input type="password" autoComplete="new-password" placeholder="请输入交易密码" />)}
          </FormItem>
          <FormItem label="确认交易密码" {...formLayout}>
            {getFieldDecorator('newPasswords', {
              rules: [
                { required: true, message: '请再次确认新的交易密码' },
                { validator: validatorPwd },
              ],
            })(<Input type="password" autoComplete="new-password" placeholder="请输入交易密码" />)}
          </FormItem>
          <FormItem {...formLayout} label="验证码">
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('checkCode', {
                  rules: [{ required: true, message: '请输入验证码' }],
                })(<Input placeholder="请输入验证码" />)}
              </Col>
              <Col span={12}>
                <Button onClick={this.getVerCode} disabled={!!secondsCount}>
                  {secondsCount ? `${secondsCount}秒后再次发送` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default DealPwdModal;
