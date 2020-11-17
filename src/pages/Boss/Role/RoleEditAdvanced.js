import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message } from 'antd';
import FunctionsCheckbox from '@/components/FunctionsCheckbox';
import functionConstant from '@/constants/functionConstant';

const FormItem = Form.Item;
const { functionDocTypeSite } = functionConstant;
const { functionDocTypeBoss } = functionConstant;

@connect(({ role, loading }) => ({
  role,
  data: role.formData,
  adding: loading.effects['role/add'],
  updating: loading.effects['role/updating'],
}))
@Form.create()
class RoleEditAdvanced extends PureComponent {
  state = {
    functionIds: [],
    functionsType: [],
  };

  componentDidMount() {
    const { data } = this.props;
    // if (data.router === 'first') {
    //   this.setBaseInfo(data);
    // }
    this.setBaseInfo(data);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (JSON.stringify(data) !== JSON.stringify(nextProps.data)) {
      this.setBaseInfo(nextProps.data);
    }
  }

  setBaseInfo = data => {
    const {
      form,
      dispatch,
      role: { formData = {}, apps = [], view: { functions = [], app: { id } = {} } = {} },
    } = this.props;
    let { appId } = formData;
    if (!appId) appId = id;
    let app = apps.find(a => String(a.id) === appId);
    if (!app) app = {};
    const { portType } = app;
    let functionsType;
    switch (portType) {
      case 'site':
        functionsType = functionDocTypeSite;
        break;
      case 'function':
        functionsType = functionDocTypeBoss;
        break;
      default:
        functionsType = functionDocTypeBoss;
    }
    this.setState({ functionsType });
    dispatch({
      type: 'role/fecthFunctions',
      payload: { appId },
    });
    let functionIds = [];
    if (!data.functionIds) {
      if (this.getId()) {
        functionIds = functions.map(item => item.id);
      }
    } else {
      functionIds = get(data, 'functionIds');
    }
    this.setState({ functionIds });
    form.setFieldsValue({
      functionIds,
    });
  };

  handleSubmit = e => {
    const {
      dispatch,
      // data,
      role: { formData = {} },
      form: { validateFields },
    } = this.props;
    e.preventDefault();
    let type;
    type = 'role/add';
    if (this.getId()) {
      type = 'role/update';
    }
    const { app: { id: appId } = {} } = formData;
    validateFields((err, values) => {
      if (!err) {
        const payload = { appId, ...formData, ...values, id: this.getId() };
        dispatch({
          type,
          payload,
          callback: result => {
            const { data: res } = result;
            if (res.code === '203') {
              message.success('保存成功');
              router.push(`/setting/role/view/${res.resultId}`);
            } else {
              message.error(`保存失败，${res.message}`);
            }
          },
        });
      }
    });
  };

  getId = () => {
    const { match } = this.props;
    const id = get(match, 'params.id');
    return id;
  };

  functionsChange = functionIds => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ functionIds });
    setFieldsValue({ functionIds });
  };

  render() {
    const {
      form: { getFieldDecorator, validateFields },
      adding,
      updating,
      dispatch,
      data: formData,
      role,
    } = this.props;
    const { functionIds, functionsType } = this.state;
    const { functions: list } = role;
    let loading;
    loading = adding;
    if (this.getId()) loading = updating;

    const functions = list.map(i => {
      const obj = i;
      obj.label = i.name;
      obj.value = i.id;
      return obj;
    });

    const lastStep = () => {
      validateFields((err, values) => {
        if (!err) {
          const payload = { ...formData, ...values, router: 'second' };
          dispatch({
            type: 'role/saveFormData',
            payload,
          });
        }
      });
      if (this.getId()) {
        router.push(`/setting/role/edit/basic/${this.getId()}`);
      } else {
        router.push(`/setting/role/add/basic`);
      }
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
        md: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
        md: { span: 22 },
      },
    };

    const buttonLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    return (
      <Fragment>
        <Form layout="horizontal" hideRequiredMark>
          <FormItem {...formItemLayout} label="功能模块">
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
                typeSource={functionsType}
                initialValue={functionIds}
              />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: buttonLayout.wrapperCol.span,
                offset: buttonLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={lastStep}>
              上一步
            </Button>
            <Button
              type="primary"
              loading={loading}
              style={{ margin: '40px 0 0 4px' }}
              onClick={this.handleSubmit}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </Fragment>
    );
  }
}

export default RoleEditAdvanced;
