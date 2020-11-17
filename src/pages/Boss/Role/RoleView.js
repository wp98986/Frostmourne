import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import functionConstant from '@/constants/functionConstant';
import styles from './Role.less';

const { Description } = DescriptionList;
const { functionSite } = functionConstant;
const ButtonGroup = Button.Group;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ role, loading }) => ({
  role,
  loading: loading.effects['role/fetchView'],
}))
class RoleView extends Component {
  state = {
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchView',
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
    router.push(`/setting/role/edit/${id}`);
  };

  delete = () => {
    const { dispatch } = this.props;
    const id = this.getId();
    dispatch({
      type: 'role/delete',
      payload: { id },
      callback: result => {
        const { data: res } = result;
        if (res.code === '203') {
          message.success('删除成功');
          router.push(`/setting/role`);
        } else {
          let msg = res.message;
          if (!msg) msg = '';
          message.error(`删除失败，${msg}`);
        }
      },
    });
  };

  render() {
    const {
      role: { view },
    } = this.props;
    let name = get(view, 'name');
    let site = get(view, 'site');
    let appName = get(view, 'app.name');
    let code = get(view, 'code');
    let remark = get(view, 'remark');
    let functions = get(view, 'functions');
    if (!name) name = '未知应用';
    if (!appName) appName = '';
    if (!remark) remark = '';
    if (!code) code = '';
    if (!functions) functions = [];
    if (site) site = functionSite[site].label;
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
      <PageHeaderWrapper title={title} action={action}>
        <Card title="角色信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList size="large">
            <Description term="应用">{appName}</Description>
            <Description term="排序号">{code}</Description>
            <Description term="备注">{remark}</Description>
            <Description term="功能模块" className={styles.blockLine}>
              {functionsText}
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RoleView;
