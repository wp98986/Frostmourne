import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Radio } from 'antd';
import PhotoUpload from '@/components/PhotoUpload';
import functionConstant from '@/constants/functionConstant';
import SelectEnum from '@/components/SelectEnum';
import AppConstant from './AppConstant';
import styles from './App.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { functionSite } = functionConstant;
const { typeEnum } = AppConstant;

@connect(({ app }) => ({
  app,
  data: app.formData,
  // submitting: loading.effects['app/fetchView'],
}))
@Form.create()
class AppEditBasic extends PureComponent {
  state = {
    // iconValue: [],
  };

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
    const {
      form,
      // app: { view },
    } = this.props;
    // const { view } = this.state;

    let dataSource = data;
    if (!dataSource) dataSource = {};
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = dataSource[key];
      if (key === 'icon') {
        // this.state.iconValue = dataSource[key];
        // let icon = [dataSource[key]];
        // if (icon) {
        //   icon = this.getUploadProps(icon);
        // }
        // obj[key] = icon;
        // this.state.iconValue = icon;
      } else if (key === 'enableFlag') {
        if (!dataSource[key] && dataSource[key] !== false) obj[key] = true;
      } else if (key === 'isDefault') {
        if (!dataSource[key]) obj[key] = false;
      }
      form.setFieldsValue(obj);
    });
  };

  getId = () => {
    const { match } = this.props;
    const id = get(match, 'params.id');
    return id;
  };

  // handlePhotoChange = data => {
  //   const { form } = this.props;
  //   this.setState({ iconValue: data });
  //   form.setFieldsValue({
  //     icon: data,
  //   });
  // };

  getUploadProps = defaultValue => {
    let initialValue;
    if (defaultValue) {
      initialValue = defaultValue.map((value, index) => {
        const imgSrc = value;
        return {
          uid: -index,
          status: 'done',
          url: imgSrc,
          origUrl: value,
        };
      });
    }
    return initialValue;
  };

  render() {
    const { form, data, dispatch } = this.props;
    const { getFieldDecorator, validateFields } = form;
    // let { iconValue } = this.state;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          // let icon = get(values, 'icon');
          // if(typeof icon === 'string') icon = [get(data, "icon")];
          // icon = icon.map(item => {
          //   if(item.origUrl) return item.origUrl;
          //   return item;
          // });
          const payload = { ...data, ...values, router: 'first' };
          dispatch({
            type: 'app/saveFormData',
            payload,
          });
          if (this.getId()) {
            router.push(`/setting/app/edit/advanced/${this.getId()}`);
          } else {
            router.push(`/setting/app/add/advanced`);
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
    // option bool
    let iconValue = get(data, 'icon');
    const yes = true;
    if (typeof iconValue === 'string') {
      iconValue = this.getUploadProps([iconValue]);
    } else if (typeof iconValue === 'object') {
      iconValue = [iconValue];
    }
    if (!this.getId()) iconValue = [];
    let siteDisabled;
    if (this.getId()) {
      siteDisabled = true;
    } else {
      siteDisabled = false;
    }
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <FormItem {...formItemLayout} label="图标">
            {getFieldDecorator('icon', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.logo.required' }),
                },
              ],
              // onChange: this.handlePhotoChange,
              initialValue: iconValue,
            })(<PhotoUpload limit={1} initialValue={iconValue} fileList={iconValue} />)}
          </FormItem>
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
          <FormItem {...formItemLayout} label="端口">
            {getFieldDecorator('portType', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.site.required' }),
                },
              ],
            })(
              <SelectEnum
                data={functionSite}
                disabled={siteDisabled}
                placeholder="请选择端口"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="类型">
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.site.required' }),
                },
              ],
            })(<SelectEnum data={typeEnum} placeholder="请选择类型" style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否有效">
            {getFieldDecorator('enableFlag', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.enableFlag.required' }),
                },
              ],
            })(
              <RadioGroup style={{ width: '100%' }}>
                <Radio value={yes}>有效</Radio>
                <Radio value={false}>无效</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否默认">
            {getFieldDecorator('isDefault', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.isDefault.required' }),
                },
              ],
            })(
              <RadioGroup style={{ width: '100%' }}>
                <Radio value={yes}>默认</Radio>
                <Radio value={false}>不默认</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="介绍">
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.desc.required' }),
                },
              ],
            })(<TextArea placeholder="填写应用介绍" autosize={{ minRows: 2, maxRows: 6 }} />)}
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

export default AppEditBasic;
