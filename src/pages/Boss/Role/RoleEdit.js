import React, { PureComponent, Fragment } from 'react';
import { connect } from 'umi';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Steps } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './Role.less';

const { Step } = Steps;

@connect(({ role, loading }) => ({
  role,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class RoleEdit extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fecthApps',
      payload: {},
    });
    dispatch({
      type: 'role/fetchView',
      payload: { id: this.getId() },
      callback: res => {
        const data = get(res, 'data');
        dispatch({
          type: 'role/saveFormData',
          payload: { ...data, router: 'first' },
        });
      },
    });
  }

  getId = () => {
    const url = window.document.location.href;
    let id = '';
    for (let i = url.length; i > 0; i--) {
      if (url.charAt(i) === '/') {
        break;
      }
      id += url.charAt(i);
    }
    const newId = parseInt(
      id
        .split('')
        .reverse()
        .join(''),
      10
    );
    return newId;
  };

  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    let path = pathList[pathList.length - 1];
    if (this.getId()) path = pathList[pathList.length - 2];
    switch (path) {
      case 'basic':
        return 0;
      case 'advanced':
        return 1;
      default:
        return 0;
    }
  }

  render() {
    const { location, children } = this.props;
    const stepsCss = { maxWidth: '750px', margin: '16px auto' };
    return (
      <PageHeaderWrapper
        title="角色编辑"
        tabActiveKey={location.pathname}
        content="填写角色基本信息以及选择相关功能。"
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} style={stepsCss}>
              <Step title="填写基本信息" />
              <Step title="选择功能模块" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RoleEdit;
