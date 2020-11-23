import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect, history } from 'umi';

import { Button, Card, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import functionConstant from '@/constants/functionConstant';
import AppConstant from './AppConstant';
import styles from './App.less';

const { Description } = DescriptionList;
const { functionSite } = functionConstant;
const { typeEnum } = AppConstant;
const ButtonGroup = Button.Group;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ app, loading }) => ({
  app,
  loading: loading.effects['app/fetchView'],
}))
class AppView extends Component {
  state = {
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/fetchView',
      payload: { id: this.getId() },
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  getId = () => {
    const { match } = this.props;
    const id = get(match, 'params.id');
    return id;
  };

  toEdit = () => {
    const id = this.getId();
    history.push(`/setting/app/edit/${id}`);
  };

  delete = () => {
    const { dispatch } = this.props;
    const id = this.getId();
    dispatch({
      type: 'app/del',
      payload: { id },
      callback: result => {
        const { data } = result;
        if (data.code === '203') {
          message.success('删除成功');
          history.push(`/setting/app`);
        } else {
          message.error(`删除失败，${data.message}`);
        }
      },
    });
  };

  render() {
    const {
      app: { view = {} },
    } = this.props;
    const {
      icon = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      name = '未知应用',
      // code = '',
      enableFlag = false,
      isDefault = '',
      description = '',
      // remark = '',
      functions = [],
    } = view;
    let { portType = '', type = '' } = view;
    if (portType) portType = functionSite[portType] ? functionSite[portType].label : '';
    if (type) type = typeEnum[type] ? typeEnum[type].label : '';
    const functionsText = [];
    functions.map((item, index) => {
      let text = `${item.name}，`;
      if (index === functions.length - 1) {
        text = item.name;
      }
      functionsText.push(text);
      return true;
    });

    const title = `${name}`;

    // const menu = (
    //   <Menu>
    //     <Menu.Item key="1" onClick={this.toEdit}>
    //       编辑
    //     </Menu.Item>
    //     <Menu.Item key="2" onClick={this.delete}>
    //       删除
    //     </Menu.Item>
    //   </Menu>
    // );

    const action = (
      <Fragment>
        <ButtonGroup>
          {
            // <Dropdown overlay={menu} placement="bottomRight">
            //   <Button onClick={this.delete}>...</Button>
            // </Dropdown>
          }
          <Button onClick={this.delete}>删除</Button>
        </ButtonGroup>
        <Button type="primary" onClick={this.toEdit}>
          编辑
        </Button>
      </Fragment>
    );

    return (
      <PageHeaderWrapper title={title} logo={<img alt="" src={icon} />} action={action}>
        <Card title="应用信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList size="large">
            <Description term="端口">{portType}</Description>
            <Description term="类型">{type}</Description>
            <Description term="是否有效">{enableFlag ? '有效' : '无效'}</Description>
            <Description term="是否默认">{isDefault ? '是' : '否'}</Description>
            <Description term="介绍">{description}</Description>
            <Description term="功能模块" className={styles.blockLine}>
              {functionsText}
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AppView;
