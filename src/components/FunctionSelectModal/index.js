import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
// import router from 'umi/router';
import { message, Modal } from 'antd';
import FunctionsCheckbox from '@/components/FunctionsCheckbox';
import functionConstant from '@/constants/functionConstant';

const FormItem = Form.Item;
const { functionDocTypeSite, functionDocTypeBoss } = functionConstant;

@connect(({ rolemanage, loading }) => ({
  rolemanage,
  submitLoading: loading.effects['rolemanage/saveFunctions'],
}))
@Form.create()
class FunctionSelectModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
  }

  state = {
    functionIds: [],
    visible: false,
    roleInfo: {},
  };

  open = (id, roleInfo) => {
    let functions = get(roleInfo, 'functions');
    if (!functions) functions = [];
    const functionIds = functions.map(item => item.id);
    if (functionIds.length > 0) {
      this.functionsChange(functionIds);
    }
    this.setState({
      visible: true,
      id,
      functionIds,
      roleInfo,
    });
  };

  close = () => {
    this.setState({
      visible: false,
    });
  };

  functionsChange = functionIds => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ functionIds });
    setFieldsValue({ functionIds });
  };

  handleOk = () => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    const { id, roleInfo } = this.state;
    const name = get(roleInfo, 'name');
    const remark = get(roleInfo, 'remark');
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'rolemanage/saveFunctions',
          payload: { ...values, id, name, remark },
          callback: result => {
            const { data: res } = result;
            if (res.code === '203') {
              message.success('保存成功');
              dispatch({
                type: 'rolemanage/roleList',
              });
              this.setState({
                visible: false,
              });
            } else {
              message.error(`保存失败，${res.message}`);
            }
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      rolemanage,
    } = this.props;
    const { functionIds, submitLoading, visible } = this.state;
    let list = get(rolemanage, 'functions');
    if (!list) list = [];
    const functions = list.map(i => {
      const obj = i;
      obj.label = i.name;
      obj.value = i.id;
      return obj;
    });

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
      },
    };
    const type = APP_TYPE === 'site' ? functionDocTypeSite : functionDocTypeBoss;
    return (
      <Modal
        ref={this.handleRef}
        title="配置功能模块"
        visible={visible}
        okText="保存"
        onOk={this.handleOk}
        okButtonProps={{ loading: submitLoading }}
        cancelText="取消"
        onCancel={this.close}
      >
        <Form layout="horizontal" hideRequiredMark>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('functionIds', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.functions.required' }),
                },
              ],
              onChange: this.functionsChange,
            })(
              <FunctionsCheckbox
                dataSource={functions}
                typeSource={type}
                initialValue={functionIds}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default FunctionSelectModal;
