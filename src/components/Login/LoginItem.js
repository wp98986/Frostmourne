import React, { Component } from 'react';
import { formatMessage } from 'umi';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Row, Col } from 'antd';
import AreaSelect from '@/components/AreaSelect';
import OrgConstant from '@/constants/OrgConstant';
import SelectEnum from '@/components/SelectEnum';
// import GeographicSelect from '@/components/GeographicSelect';
import omit from 'omit.js';
import styles from './index.less';
import ItemMap from './map';
import LoginContext from './loginContext';

const { siteOrgTypeEnum } = OrgConstant;
const FormItem = Form.Item;

class WrapFormItem extends Component {
  static defaultProps = {
    getCaptchaButtonText: formatMessage({ id: 'form.captcha' }),
    getCaptchaSecondText: formatMessage({ id: 'form.captcha.second' }),
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    const { updateActive, name } = this.props;
    if (updateActive) {
      updateActive(name);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { onGetCaptcha } = this.props;
    const result = onGetCaptcha ? onGetCaptcha() : null;
    if (result === false) {
      return;
    }
    if (result instanceof Promise) {
      result.then(this.runGetCaptchaCountDown);
    } else {
      this.runGetCaptchaCountDown();
    }
  };

  getFormItemOptions = ({ onChange, defaultValue, customprops, rules }) => {
    const options = {
      rules: rules || customprops.rules,
    };
    if (onChange) {
      options.onChange = onChange;
    }
    if (defaultValue) {
      options.initialValue = defaultValue;
    }
    return options;
  };

  runGetCaptchaCountDown = () => {
    const { countDown } = this.props;
    let count = countDown || 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  render() {
    const { count } = this.state;

    const {
      form: { getFieldDecorator },
    } = this.props;

    // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props
    const {
      onChange,
      customprops,
      defaultValue,
      rules,
      name,
      getCaptchaButtonText,
      getCaptchaSecondText,
      updateActive,
      type,
      ...restProps
    } = this.props;
    // get getFieldDecorator props
    const options = this.getFormItemOptions(this.props);
    delete siteOrgTypeEnum.jointVenture;
    const otherProps = restProps || {};
    if (type === 'Captcha') {
      const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
      return (
        <FormItem>
          <Row gutter={8}>
            <Col span={16}>
              {getFieldDecorator(name, options)(<Input {...customprops} {...inputProps} />)}
            </Col>
            <Col span={8}>
              <Button
                disabled={count}
                className={styles.getCaptcha}
                size="large"
                onClick={this.onGetCaptcha}
              >
                {count ? `${count} ${getCaptchaSecondText}` : getCaptchaButtonText}
              </Button>
            </Col>
          </Row>
        </FormItem>
      );
    }
    if (type === 'Area') {
      return (
        <FormItem>
          {getFieldDecorator(name, options)(<AreaSelect {...customprops} {...otherProps} />)}
        </FormItem>
      );
    }
    if (type === 'OrgType') {
      return (
        <FormItem>
          {getFieldDecorator(
            name,
            options
          )(
            <SelectEnum
              className={styles.select}
              data={siteOrgTypeEnum}
              {...customprops}
              {...otherProps}
            />
          )}
        </FormItem>
      );
    }
    return (
      <FormItem>
        {getFieldDecorator(name, options)(<Input {...customprops} {...otherProps} />)}
      </FormItem>
    );
  }
}

const LoginItem = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  LoginItem[key] = props => (
    <LoginContext.Consumer>
      {context => (
        <WrapFormItem
          className={styles.formItem}
          customprops={item.props}
          rules={item.rules}
          type={key}
          {...props}
          updateActive={context.updateActive}
          form={context.form}
        />
      )}
    </LoginContext.Consumer>
  );
});

export default LoginItem;
