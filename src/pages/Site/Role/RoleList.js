import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';

import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, List, Button, Modal, Input, message, Menu, Dropdown } from 'antd';

// import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FunctionSelectModal from '@/components/FunctionSelectModal';

import styles from './Role.less';

const FormItem = Form.Item;

@connect(({ rolemanage, user, loading }) => ({
  rolemanage,
  currentUser: user.currentUser,
  loading: loading.models.role,
}))
@Form.create()
class RoleList extends PureComponent {
  state = {
    visible: false,
    confirmLoading: false,
    roleInfo: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rolemanage/roleList',
    });
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const { dispatch, currentUser } = nextProps;
  //   const { orgId } = this.state;
  //   const id = get(currentUser, 'data.org.id');
  //   const hasId = id === orgId;
  //   if (!hasId) {
  //     dispatch({
  //       type: 'rolemanage/fetchOrgInfo',
  //       payload: { id },
  //     });
  //     this.setState({
  //       orgId: id,
  //     });
  //   }
  // }

  openModal = (id, isEdit) => {
    const { dispatch } = this.props;
    if (isEdit) {
      dispatch({
        type: 'rolemanage/fetchInfo',
        payload: { id },
        callback: data => {
          this.setState({
            roleInfo: data,
            visible: true,
          });
        },
      });
    } else {
      this.setState({
        visible: true,
      });
    }
  };

  closeModal = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      confirmLoading: false,
      visible: false,
      roleInfo: {},
    });
  };

  saveRole = () => {
    this.setState({
      confirmLoading: true,
    });
    const { roleInfo } = this.state;
    const id = get(roleInfo, 'id');
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        let type = 'rolemanage/addRole';
        if (JSON.stringify(roleInfo) !== '{}') type = 'rolemanage/updateRole';
        dispatch({
          type,
          payload: { ...values, id },
          callback: result => {
            const { data: res } = result;
            if (res.code === '203') {
              message.success('保存成功');
              dispatch({
                type: 'rolemanage/roleList',
              });
            } else {
              message.error(`保存失败，${res.message}`);
            }
            this.closeModal();
          },
        });
      }
    });
  };

  confirmDelete = id => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确认',
      content: '确认删除该应用？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'rolemanage/deleteRole',
          payload: { id },
          callback: result => {
            const { data: res } = result;
            if (res.code === '203') {
              message.success('保存成功');
              dispatch({
                type: 'rolemanage/roleList',
              });
            } else {
              message.error(`删除失败，${res.message}`);
            }
          },
        });
      },
    });
  };

  openFunctionModal = (id, roleInfo, orgId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rolemanage/fetchInfo',
      payload: { id },
      callback: data => {
        this.setState({
          roleInfo: data,
        });
        this.functionModal.open(id, data);
      },
    });
    const portType = APP_TYPE;
    dispatch({
      type: 'rolemanage/fecthFunctions',
      payload: { orgId, portType },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      rolemanage: { list: data },
      currentUser: { data: user = {} },
      loading,
    } = this.props;
    const { org: { id: orgId } = {} } = user;
    const { visible, confirmLoading, roleInfo } = this.state;

    // let appAuths = get(orgInfo, "appAuths");
    // if(!appAuths) appAuths = [];
    // const apps = appAuths.map(item => {
    //   const app = {
    //     name: item.app.name,
    //     id: item.app.id
    //   }
    //   return app;
    // })
    let name = get(roleInfo, 'name');
    let remark = get(roleInfo, 'remark');
    let list = get(data, 'modelList');
    if (!list) list = [];
    if (!name) name = '';
    if (!remark) remark = '';

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 20 },
      },
    };

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>创建和维护角色，配置角色相关的功能模块。</p>
        {
          // <div className={styles.contentLink}>
          //   <a>
          //     <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
          //     快速开始
          //   </a>
          //   <a>
          //     <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
          //     产品简介
          //   </a>
          //   <a>
          //     <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
          //     产品文档
          //   </a>
          // </div>
        }
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    return (
      <PageHeaderWrapper title="角色信息" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ column: 3, gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...list, '']}
            renderItem={item =>
              item ? (
                <List.Item key={item.id} className={styles.listItem}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <a onClick={() => this.openFunctionModal(item.id, item, orgId)}>配置权限</a>,
                      <Dropdown
                        overlay={
                          <Menu className={styles.menu} selectedKeys={[]}>
                            <Menu.Item key="joinOrg">
                              <a onClick={() => this.confirmDelete(item.id)}>删除角色</a>
                            </Menu.Item>
                            <Menu.Item key="addOrg">
                              <a onClick={() => this.openModal(item.id, true)}>编辑角色</a>
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <span>更多</span>
                      </Dropdown>,
                    ]}
                  >
                    <UserOutlined />
                    <div className={styles.name}>{item.name}</div>
                    <div className={styles.remark}>{item.remark}</div>
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton} onClick={this.openModal}>
                    <PlusOutlined /> 新增角色
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <Modal
          title={name ? '编辑角色' : '创建角色'}
          visible={visible}
          onOk={this.saveRole}
          confirmLoading={confirmLoading}
          onCancel={this.closeModal}
        >
          <Form layout="horizontal" hideRequiredMark>
            <FormItem {...formItemLayout} label="角色名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.name.required' }),
                  },
                ],
                initialValue: name,
              })(<Input placeholder="请输入角色名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark', {
                initialValue: remark,
              })(<Input placeholder="填写备注" />)}
            </FormItem>
          </Form>
        </Modal>
        <FunctionSelectModal
          getInstance={ref => {
            this.functionModal = ref;
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
