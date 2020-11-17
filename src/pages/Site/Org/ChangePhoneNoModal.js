import React from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Button, Input, Modal, message } from 'antd';
import { validatorPhone } from '@/utils/formUtils';
import styles from './OrgInfo.less';

const FormItem = Form.Item;
// const RadioGroup = Radio.Group;

@connect()
@Form.create()
class ChangePhoneNoModal extends React.Component {
  state = {
    disabledOld: true,
    disabledNew: true,
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancelModal = () => {
    clearInterval(this.intervaldisabledOld);
    clearInterval(this.intervaldisabledNew);
    this.setState({
      modalVisible: false,
      newCount: 0,
      oldCount: 0,
      disabledOld: true,
      disabledNew: true,
    });
  };

  oldBlurHandle = (name, disarg) => {
    const { form: { getFieldError } = {} } = this.props;
    const error = getFieldError(name);
    if (!error) {
      this.setState({
        [disarg]: false,
      });
    } else {
      this.setState({
        [disarg]: true,
      });
    }
  };

  timeFun = (secondsCount, btnName) => {
    this.setState({
      [btnName]: true,
    });
    let count = 60;
    const timerName = `interval${btnName}`;
    this[timerName] = setInterval(() => {
      count -= 1;
      if (count === 0) {
        this.setState({
          [btnName]: false,
        });
        clearInterval(this[timerName]);
      }
      this.setState({
        [secondsCount]: count,
      });
    }, 1000);
  };

  getVerCode = (secondsCount, btnName) => {
    // 获取验证码
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfo/sendVerCode',
      payload: {},
      callback: () => {
        //
      },
    });
    this.timeFun(secondsCount, btnName);
  };

  bankHandleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'balancewidthdraw/addcard',
        payload: { ...fieldsValue },
        callback: res => {
          const {
            data: { code, message: returnMessage },
          } = res;
          if (code === '203') {
            message.success('绑定成功！');
            this.handleCancelModal();
            // if (reloadData) reloadData();
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
    const { modalVisible, disabledOld, disabledNew, oldCount, newCount } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    return (
      <Modal
        title="绑定手机"
        className={styles.standardListForm}
        width={640}
        destroyOnClose
        visible={modalVisible}
        okText="保存"
        onOk={this.bankHandleSubmit}
        onCancel={this.handleCancelModal}
      >
        <Form>
          <FormItem label="原手机号" {...formLayout}>
            {getFieldDecorator('oldmobile', {
              rules: [{ required: true, message: '请输入原手机号' }, { validator: validatorPhone }],
            })(
              <Input
                placeholder="请输入原手机号"
                disabled={!!oldCount}
                onBlur={() => {
                  this.oldBlurHandle('oldmobile', 'disabledOld');
                }}
              />
            )}
          </FormItem>
          <FormItem {...formLayout} label="验证码">
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('vercode')(<Input placeholder="请输入验证码" />)}
              </Col>
              <Col span={12}>
                <Button
                  disabled={disabledOld}
                  onClick={() => {
                    this.getVerCode('oldCount', 'disabledOld');
                  }}
                >
                  {oldCount ? `${oldCount}秒后再次发送` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="新手机号" {...formLayout}>
            {getFieldDecorator('newmobile', {
              rules: [
                { required: true, message: '请输入新绑定手机号' },
                { validator: validatorPhone },
              ],
            })(
              <Input
                placeholder="请输入新手机号"
                disabled={!!newCount}
                onBlur={() => {
                  this.oldBlurHandle('newmobile', 'disabledNew');
                }}
              />
            )}
          </FormItem>
          <FormItem {...formLayout} label="验证码">
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('newvercode')(<Input placeholder="请输入验证码" />)}
              </Col>
              <Col span={12}>
                <Button
                  disabled={disabledNew}
                  onClick={() => {
                    this.getVerCode('newCount', 'disabledNew');
                  }}
                >
                  {newCount ? `${newCount}秒后再次发送` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ChangePhoneNoModal;
