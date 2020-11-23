import React, { PureComponent } from 'react';
import { connect, history } from 'umi';

import {
  BlockOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  InteractionOutlined,
  MobileOutlined,
  TrademarkOutlined,
  UserOutlined,
} from '@ant-design/icons';

// import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import { Card, Row, Col, Avatar, Divider, Spin, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import AvatarView from '@/components/AvatarView';
import { getBtns } from '@/utils/authority';
import orgConstant from '@/constants/OrgConstant';
import styles from './OrgInfo.less';

const { orgTypeEnum } = orgConstant;

@connect(({ loading, user, orgInfo, project }) => ({
  orgInfo,
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  orgLoading: loading.effects['orgInfo/fetchView'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
class OrgInfo extends PureComponent {
  state = {
    newTags: [],
    // inputVisible: false,
    inputValue: '',
    orgId: null,
    activeTabKey: 'department',
  };

  componentDidMount() {
    const { route: { platFlag } = {} } = this.props;
    if (platFlag) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfo/fetchChild',
      payload: { orgId: this.getId() },
    });
  }

  handleStandardTableChange = pagination => {
    const {
      dispatch,
      orgInfo: {
        accounts: { pagination: currentpagination },
      },
    } = this.props;
    currentpagination.current = pagination.current;
    // const { formValues, activeKey } = this.state;

    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});

    // const params = {
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...formValues,
    //   ...filters,
    // };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    dispatch({
      type: 'orgInfo/fetchChild',
      payload: { orgId: this.getId(), page: pagination.current },
    });
  };

  getId = () => {
    const { match } = this.props;
    const id = get(match, 'params.id');
    return id;
  };

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'department':
        history.push(`${match.url}/department`);
        break;
      case 'paypwd':
        history.push(`${match.url}/paypwd`);
        break;
      default:
        break;
    }
    this.setState({
      activeTabKey: key,
    });
  };

  // showInput = () => {
  //   // this.setState({ inputVisible: true }, () => this.input.focus());
  // };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      // inputVisible: false,
      inputValue: '',
    });
  };

  getAvatarURL = () => {
    const { orgInfo } = this.props;
    const logo = get(orgInfo, 'view.logo');
    if (logo) {
      return logo;
    }
    return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
  };

  logoChange = fileList => {
    const {
      dispatch,
      currentUser: {
        data: {
          org: { id },
        },
      },
    } = this.props;
    dispatch({
      type: 'orgInfo/updateOrg',
      payload: { logo: fileList, id: this.getId() || id },
      callback: result => {
        const { data } = result;
        if (data.code === '203') {
          message.success('更换成功');
          dispatch({
            type: 'user/fetchCurrent',
          });
          dispatch({
            type: 'orgInfo/fetchView',
            payload: { id: this.getId() },
          });
        } else {
          let msg = '';
          if (data.message) msg = `，${data.message}`;
          message.error(`更换失败${msg}`);
        }
      },
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dispatch, currentUser } = nextProps;
    const { orgId } = this.state;
    this.setState({
      activeTabKey: window.location.href.substring(window.location.href.lastIndexOf('/') + 1),
    });
    let id;
    if (this.getId()) {
      id = this.getId();
    } else {
      id = get(currentUser, 'data.org.id');
    }
    const hasId = id === orgId;
    if (!hasId) {
      dispatch({
        type: 'orgInfo/fetchView',
        payload: { id },
      });
      this.setState({
        orgId: id,
      });
    }
  }

  render() {
    // const { newTags, inputVisible, inputValue } = this.state;
    const {
      listLoading,
      orgInfo: { view = {} },
      orgLoading,
      // projectLoading,
      currentUser: { data: { pages = [] } = {} } = {},
      route,
      // route: { platFlag } = {},
      children,
    } = this.props;
    const buttons = getBtns(pages, route);
    const hasDealPwd = buttons.filter(b => b === 'dealPwd').length > 0;
    const { activeTabKey } = this.state;
    const { appAuths = [], orgType, supplyScope, brands = [] } = view;
    let area = '暂无';
    if (get(view, 'province') && get(view, 'city') && get(view, 'district')) {
      area = `${get(view, 'province')}${get(view, 'city')}${get(view, 'district')}`;
    }
    let brandsTxt = '';
    for (let i = 0; i < brands.length; i++) {
      if (i !== brands.length - 1) {
        brandsTxt += `${brands[i].brandName},`;
      } else {
        brandsTxt += `${brands[i].brandName}`;
      }
    }

    const operationTabList = [
      {
        key: 'department',
        tab: <span>部门</span>,
      },
    ];
    if (hasDealPwd) {
      operationTabList.push({
        key: 'paypwd',
        tab: <span>交易密码</span>,
      });
    }
    // console.log(this.props);
    return (
      <GridContent>
        <Row gutter={24} className={styles.userCenter}>
          <Col lg={6} md={24}>
            <Card bordered={false} className={styles.info} loading={orgLoading}>
              <div>
                <div className={styles.avatarHolder}>
                  <AvatarView
                    className={styles.avatar}
                    ref={c => {
                      this.avatar = c;
                    }}
                    src={this.getAvatarURL()}
                    onChange={this.logoChange}
                    title="更换图标"
                  />

                  <div className={styles.name}>{view.name}</div>
                  {
                    // <div className={styles.name}>{currentUser.name}</div>
                    // <div>{currentUser.signature}</div>
                  }
                </div>
                <div className={styles.detail}>
                  <p>
                    <UserOutlined />
                    联系人：{view.contact}
                  </p>
                  <p>
                    <MobileOutlined />
                    联系电话：{view.mobile}
                  </p>
                  <p>
                    <CompassOutlined />
                    省市区：{area}
                  </p>
                  <p>
                    <EnvironmentOutlined />
                    详细地址：{view.address}
                  </p>
                  {APP_TYPE === 'supplier' ? (
                    <div>
                      <p>
                        <BlockOutlined />
                        供应商类型：{orgType}
                      </p>
                      <p>
                        <InteractionOutlined />
                        供应范围：{supplyScope}
                      </p>
                      <p>
                        <TrademarkOutlined />
                        经营品牌：{brandsTxt}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>
                        <BlockOutlined />
                        企业性质：{orgTypeEnum[view.orgType] ? orgTypeEnum[view.orgType].label : ''}
                      </p>
                    </div>
                  )}
                  {
                    // <p>
                    //   <Icon type="solution" />
                    //   邀请码：{view.inviteCode}
                    // </p>
                  }
                </div>
                <Divider style={{ marginTop: 16 }} dashed />
                <div className={styles.team}>
                  <div className={styles.teamTitle}>已有应用</div>
                  <Spin spinning={false}>
                    <Row gutter={36} className={styles.appList}>
                      {appAuths.map(item => (
                        <Col key={item.app.id} lg={24} xl={24}>
                          {
                            // <Link to={item.href}>
                          }
                          <Avatar size="small" src={item.app.icon} />
                          {item.app.name}
                          {
                            // </Link>
                          }
                        </Col>
                      ))}
                    </Row>
                  </Spin>
                </div>
              </div>
            </Card>
          </Col>
          <Col lg={18} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={activeTabKey}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default OrgInfo;
