import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';
// import functionConstant from '@/constants/functionConstant';
// import SelectEnum from '@/components/SelectEnum';
import AppSelect from '@/components/AppSelect';
import styles from './Role.less';

const FormItem = Form.Item;
const { TextArea } = Input;
// const { functionSite } = functionConstant;

@connect(({ role, loading }) => ({
  role,
  data: role.formData,
  submitting: loading.effects['role/fetchView'],
}))
@Form.create()
class RoleEditBasic extends PureComponent {
  componentDidMount() {
    const { data } = this.props;
    // if(data.router === 'second'){
    this.setBaseInfo(data);
    // }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (JSON.stringify(data) !== JSON.stringify(nextProps.data)) {
      this.setBaseInfo(nextProps.data);
    }
  }

  setBaseInfo = data => {
    const { form } = this.props;
    let dataSource = data;
    if (!dataSource) dataSource = {};
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = dataSource[key];
      if (key === 'appId') {
        if (dataSource[key]) {
          obj[key] = dataSource[key];
        } else {
          const appId = get(dataSource, 'app.id');
          if (appId) {
            obj[key] = String(appId);
          } else {
            obj[key] = undefined;
          }
        }
      }
      form.setFieldsValue(obj);
    });
  };

  getId = () => {
    const { match } = this.props;
    const id = get(match, 'params.id');
    return id;
  };

  render() {
    const {
      form,
      // data,
      dispatch,
      role: { apps },
    } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const payload = { ...values, router: 'first' };
          dispatch({
            type: 'role/saveFormData',
            payload,
          });
          if (this.getId()) {
            router.push(`/setting/role/edit/advanced/${this.getId()}`);
          } else {
            router.push(`/setting/role/add/advanced`);
          }
        }
      });
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 },
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
    // let siteDisabled;
    // if (this.getId()) {
    //   siteDisabled = true;
    // } else {
    //   siteDisabled = false;
    // }
    // const formValues = form.getFieldsValue();
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.name.required' }),
                },
              ],
            })(<Input placeholder="请输入名称" />)}
          </FormItem>
          {
            // <FormItem {...formItemLayout} label="端口">
            //   {getFieldDecorator('site', {
            //     rules: [
            //       {
            //         required: true,
            //         message: formatMessage({ id: 'validation.site.required' }),
            //       },
            //     ],
            //     onChange: this.siteChange,
            //   })(
            //     <SelectEnum
            //       data={functionSite}
            //       disabled={siteDisabled}
            //       placeholder="请选择端口"
            //       style={{ width: '100%' }}
            //     />
            //   )}
            // </FormItem>
          }
          <FormItem {...formItemLayout} label="应用">
            {getFieldDecorator('appId', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.app.required' }),
                },
              ],
            })(
              <AppSelect
                dataSource={apps}
                // placeholder={!formValues.site ? '请先选择端口' : '请选择'}
                onChange={this.appChange}
                placeholder="请选择"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="排序号">
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.sortCode.required' }),
                },
              ],
            })(<Input placeholder="请输入排序号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {})(
              <TextArea placeholder="填写备注" autosize={{ minRows: 2, maxRows: 6 }} />
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
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </FormItem>
        </Form>
      </Fragment>
    );
  }
}

export default RoleEditBasic;
