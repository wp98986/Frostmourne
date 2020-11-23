import React, { PureComponent, Fragment } from 'react';
import { connect, history, formatMessage } from 'umi';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message } from 'antd';
import FunctionsCheckbox from '@/components/FunctionsCheckbox';
import functionConstant from '@/constants/functionConstant';

const FormItem = Form.Item;
const { functionDocTypeSite } = functionConstant;
const { functionDocTypeBoss } = functionConstant;

@connect(({ app, loading }) => ({
  app,
  data: app.formData,
  adding: loading.effects['app/add'],
  updating: loading.effects['app/updating'],
}))
@Form.create()
class AppEditAdvanced extends PureComponent {
  state = {
    functionIds: [],
    functionsType: [],
  };

  componentDidMount() {
    const { data } = this.props;
    if (data.router === 'first') {
      this.setBaseInfo(data);
    }
  }

  setBaseInfo = data => {
    // console.log(data)
    const { form, dispatch } = this.props;
    const portType = get(data, 'portType');
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
      type: 'app/fetchFunctions',
      payload: { portType, pageSize: 9999 },
    });
    let functionIds = [];
    if (!data.functionIds) {
      if (this.getId()) {
        const { functions = [] } = data;
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
      data,
      form: { validateFields },
    } = this.props;
    e.preventDefault();
    let type;
    type = 'app/add';
    if (this.getId()) {
      type = 'app/update';
    }
    validateFields((err, values) => {
      if (!err) {
        if (data.icon instanceof Array) data.icon = data.icon[0];
        if (this.getId()) data.id = this.getId();
        let icon = get(data, 'icon');
        if (typeof icon === 'object') {
          const url = get(icon, 'origUrl');
          icon = url;
        }
        const payload = { ...values, ...data, icon };
        dispatch({
          type,
          payload,
          callback: result => {
            const { data: res } = result;
            if (res.code === '203') {
              message.success('保存成功');
              history.push(`/setting/app/view/${res.resultId}`);
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (JSON.stringify(data) !== JSON.stringify(nextProps.data)) {
      this.setBaseInfo(nextProps.data);
    }
  }

  render() {
    const {
      form: { getFieldDecorator, validateFields },
      adding,
      updating,
      dispatch,
      data: formData,
      app: { functionsList },
    } = this.props;
    const { functionIds, functionsType } = this.state;
    let list = functionsList.modelList;
    if (!list) list = [];
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
            type: 'app/saveFormData',
            payload,
          });
        }
      });
      if (this.getId()) {
        history.push(`/setting/app/edit/basic/${this.getId()}`);
      } else {
        history.push(`/setting/app/add/basic`);
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

export default AppEditAdvanced;
