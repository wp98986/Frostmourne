import React, { PureComponent } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Card, Button, Col, Row, Input, Select, Popover, message } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SelectEnum from '@/components/SelectEnum';
import PropertyBagConstant from '@/constants/PropertyBagConstant';
import TableForm from './TableForm';
import styles from './PropertyBag.less';

const { Option } = Select;
const { TextArea } = Input;
const { typeEnum } = PropertyBagConstant;
const fieldLabels = {
  name: '属性包名',
  code: '编码',
  type: '类型',
  enableFlag: '是否有效',
  remark: '备注',
};

@connect(({ propertybag, loading }) => ({
  propertybag,
  submitting: loading.effects['propertybag/add'],
}))
@Form.create()
class AdvancedForm extends PureComponent {
  state = {
    width: '100%',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const id = this.getId();
    if (id) {
      dispatch({
        type: 'propertybag/fetchView',
        payload: { id },
      });
    }
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getId = () => {
    const { match } = this.props;
    const id = get(match, 'params.id');
    return id;
  };

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <LegacyIcon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <ExclamationCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const propertys = this.form.getFormValue();
        let canSave = true;
        propertys.map(item => {
          if (!item.type) {
            message.error('请填写完整属性信息');
            canSave = false;
          } else if (item.type) {
            if (item.type === 'input') {
              if (!item.name) {
                message.error('请填写完整属性信息');
                canSave = false;
              }
            } else if (item.type !== 'input') {
              if (!item.name || !item.optionValue) {
                message.error('请填写完整属性信息');
                canSave = false;
              }
            }
          }
          return item;
        });
        if (!canSave) {
          return;
        }
        let type = 'propertybag/add';
        let id;
        if (this.getId()) {
          type = 'propertybag/update';
          id = this.getId();
        }
        dispatch({
          type,
          payload: { ...values, propertys, id },
          callback: result => {
            const { data } = result;
            if (data.code === '203') {
              message.success('保存成功');
              router.push(`/setting/propertybag/view/${data.resultId}`);
            } else {
              let msg = '';
              if (data.message) msg = `，${data.message}`;
              message.error(`保存失败${msg}`);
            }
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      propertybag: { view },
      submitting,
    } = this.props;
    const { width } = this.state;
    const yes = true;
    let propertys = get(view, 'propertys');
    if (!propertys) propertys = [];
    const keyData = propertys.map((item, index) => {
      const newItem = { ...item, key: index + 1 };
      return newItem;
    });
    let name;
    let code;
    let enableFlag;
    let remark;
    let type;
    if (view && Object.keys(view).length && this.getId()) {
      name = get(view, 'name');
      code = get(view, 'code');
      type = get(view, 'type');
      enableFlag = get(view, 'isValid');
      remark = get(view, 'remark');
    }
    return (
      <PageHeaderWrapper
        title="属性包信息"
        content="注:同类型的有效属性包只有最后一个会被使用"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="基础信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col xl={{ span: 6 }} lg={{ span: 8 }} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入属性包名' }],
                    initialValue: name,
                  })(<Input placeholder="请输入属性包名" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.code}>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入编码' }],
                    initialValue: code,
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {getFieldDecorator('type', {
                    rules: [{ required: true, message: '请选择类型' }],
                    initialValue: type,
                  })(<SelectEnum data={typeEnum} placeholder="选择类型" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.enableFlag}>
                  {getFieldDecorator('isValid', {
                    rules: [{ required: true, message: '请选择是否有效' }],
                    initialValue: enableFlag,
                  })(
                    <Select placeholder="请选择">
                      <Option value={yes}>是</Option>
                      <Option value={false}>否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={12} sm={24}>
                <Form.Item label={fieldLabels.remark}>
                  {getFieldDecorator('remark', {
                    initialValue: remark,
                  })(<TextArea placeholder="填写备注" autosize={{ minRows: 2, maxRows: 4 }} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="属性" bordered={false}>
          {getFieldDecorator('propertys', {
            initialValue: this.getId() ? keyData : [],
          })(
            <TableForm
              ref={form => {
                this.form = form;
              }}
            />
          )}
        </Card>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedForm;
