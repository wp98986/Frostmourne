import React, { Component, Fragment } from 'react';

import {
  CheckOutlined,
  DownOutlined,
  EditOutlined,
  FlagOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Row,
  Col,
  Input,
  Menu,
  Badge,
  Dropdown,
  Divider,
  Popconfirm,
  Drawer,
  Button,
  message,
  Popover,
} from 'antd';
import { connect } from 'umi';
import StandardTable from '@/components/StandardTable';
import DeptSelect from '@/components/DeptSelect';
import BasicSelect from '@/components/BasicSelect';
import { validatorPhone, validatorRealName } from '@/utils/formUtils';
import styles from './OrgInfo.less';

const SubMenu = Menu.SubMenu;

const staffMenuEnum = [
  {
    label: '所有人员',
    key: 'allStaff',
    iconType: 'team',
  },
  {
    label: '新加入的人员',
    key: 'newStaff',
    iconType: 'usergroup-add',
  },
  {
    label: '未分配部门的人员',
    key: 'freeStaff',
    iconType: 'user',
  },
];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ loading, orgInfo, user }) => ({
  orgInfo,
  currentUser: user.currentUser,
  staffLoading: loading.effects['orgInfo/fetchStaffs'],
  deptLoading: loading.effects['orgInfo/fetchDepts'],
  submitLoading: loading.effects['orgInfo/saveStaff'],
}))
@Form.create()
class Department extends Component {
  state = {
    // userName: null,
    activeKey: 'allStaff',
    activeKeyText: '所有人员',
    visible: false,
    deptPop: false,
    childrenDeptPop: false,
    deptInput: '',
    childrenDeptInput: '',
    activeDeptId: undefined,
    parentId: undefined,
    selectedRows: [],
    staffId: null,
    userInfo: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { activeKey } = this.state;
    dispatch({
      type: 'orgInfo/roleList',
      payload: { orgId: this.getId() },
    });
    dispatch({
      type: 'orgInfo/fetchStaffs',
      payload: { type: activeKey, orgId: this.getId(), page: 1 },
    });
    dispatch({
      type: 'orgInfo/fetchDepts',
      payload: { parentId: 0, orgId: this.getId() },
    });
  }

  getId = () => {
    const { match } = this.props;
    const id = get(match, 'params.id');
    return id;
  };

  // onChangeUserName = e => {
  //   this.setState({
  //     userName: e.target.value
  //   })
  // };

  // emitEmpty = () => {
  //   this.setState({ userName: '' });
  // };

  menuClick = e => {
    const { dispatch } = this.props;
    this.setState({
      activeKey: e.key,
      activeKeyText: e.item.props.children[1],
      activeDeptId: undefined,
    });
    const payload = {};
    const today = new Date();
    if (e.key === 'freeStaff') payload.isNoDept = true;
    if (e.key === 'newStaff')
      payload.createDateStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7
      );
    payload.orgId = this.getId();
    dispatch({
      type: 'orgInfo/fetchStaffs',
      payload: { ...payload, type: e.key, page: 1 },
    });
  };

  onClose = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
      staffId: null,
    });
  };

  updateStaff = userInfo => {
    const { form, dispatch } = this.props;
    if (APP_TYPE === 'site') {
      dispatch({
        type: 'orgInfo/fetchStores',
        payload: {},
      });
    }
    dispatch({
      type: 'orgInfo/fetchDeptSelect',
      payload: { orgId: this.getId() },
    });
    dispatch({
      type: 'orgInfo/fetchDepts',
      payload: { parentId: 0, orgId: this.getId() },
    });
    dispatch({
      type: 'orgInfo/findStaff',
      payload: { id: userInfo.id, orgId: this.getId() },
      callback: response => {
        const data = get(response, 'data');
        if (data) {
          this.setState({
            userInfo: data,
          });
          const user = get(data, 'user');
          Object.keys(form.getFieldsValue()).forEach(key => {
            const obj = {};
            obj[key] = user[key];
            if (key === 'deptId') {
              let deptId = get(userInfo, 'deptId');
              if (deptId) deptId = String(deptId);
              obj[key] = deptId;
            }
            if (key === 'deptIds') {
              let depts = get(userInfo, 'depts');
              if (!depts) depts = [];
              obj[key] = depts.map(item => String(item.id));
            }
            if (key === 'storeId') {
              let storeId = get(data, 'store.id');
              if (storeId) storeId = String(storeId);
              obj[key] = storeId;
            }
            if (key === 'manageStoreIds') {
              let manageStores = get(data, 'manageStores');
              if (!manageStores) manageStores = [];
              obj[key] = manageStores.map(item => String(item.id));
            }
            if (key === 'jobNo') {
              const jobNo = get(data, 'jobNo');
              obj[key] = jobNo;
            }
            if (key === 'roleIds') {
              const roles = get(data, 'roles');
              const roleIds = roles.map(r => String(r.id));
              obj[key] = roleIds;
            }
            form.setFieldsValue(obj);
          });
        }
      },
    });
    this.setState({
      visible: true,
      staffId: userInfo.id,
      userId: userInfo.user.id,
    });
  };

  addStaff = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfo/fetchStores',
      payload: {},
    });
    dispatch({
      type: 'orgInfo/fetchDeptSelect',
      payload: { orgId: this.getId() },
    });
    this.setState({
      visible: true,
    });
  };

  staffMenuClick = (key, data) => {
    const {
      dispatch,
      orgInfo: {
        staffs: { pagination },
      },
    } = this.props;
    const { activeDeptId, activeKey } = this.state;
    this.setState({
      parentId: undefined,
    });
    if (key) {
      switch (key) {
        case 'del':
          dispatch({
            type: 'orgInfo/delStaff',
            payload: { id: data.id, orgId: this.getId() },
            callback: result => {
              const { data: res } = result;
              if (res.code === '203') {
                message.success('删除成功');
                dispatch({
                  type: 'orgInfo/fetchStaffs',
                  payload: {
                    deptId: activeDeptId,
                    orgId: this.getId(),
                    type: activeKey,
                    page: pagination.current,
                  },
                });
              } else {
                message.error(`删除失败，${res.message}`);
              }
            },
          });
          break;
        case 'reFormDept':
          dispatch({
            type: 'orgInfo/updateStaff',
            payload: { ...data.user, deptId: '', id: data.id, orgId: this.getId() },
            callback: result => {
              const { data: res } = result;
              if (res.code === '203') {
                message.success('移除成功');
                dispatch({
                  type: 'orgInfo/fetchStaffs',
                  payload: {
                    deptId: activeDeptId,
                    orgId: this.getId(),
                    type: activeKey,
                    page: pagination.current,
                  },
                });
              } else {
                message.error(`移除失败，${res.message}`);
              }
            },
          });
          break;
        case 'resetPwd':
          dispatch({
            type: 'orgInfo/staffResetPwd',
            payload: { id: data.id, orgId: this.getId() },
            callback: result => {
              const { data: res } = result;
              if (res.code === '203') {
                message.success('重置成功');
              } else {
                message.error(`重置失败，${res.message}`);
              }
            },
          });
          break;
        default:
          return null;
      }
    }
    return true;
  };

  changeRole = (staffInfo, currentRoleId, isChecked) => {
    // isChecked已经选中
    const {
      dispatch,
      orgInfo: {
        staffs: { pagination },
      },
    } = this.props;
    const { activeDeptId, activeKey } = this.state;
    const { id, roles = [] } = staffInfo;
    let roleIds = roles.map(role => role.id);
    if (isChecked) {
      roleIds = roleIds.filter(roleId => roleId !== currentRoleId);
    } else {
      roleIds.push(currentRoleId);
    }
    dispatch({
      type: 'orgInfo/updateStaffRole',
      payload: {
        id,
        roleIds,
      },
      callback: result => {
        const { data: res } = result;
        if (res.code === '203') {
          message.success('更改成功');
          dispatch({
            type: 'orgInfo/fetchStaffs',
            payload: {
              deptId: activeDeptId,
              orgId: this.getId(),
              type: activeKey,
              page: pagination.current,
            },
          });
        } else {
          message.error(`更改失败，${res.message}`);
        }
      },
    });
  };

  saveStaff = () => {
    const {
      dispatch,
      form: { validateFields, resetFields },
      orgInfo: {
        staffs: { pagination },
      },
    } = this.props;

    const { activeDeptId, staffId, userId, userInfo, activeKey } = this.state;
    const type = staffId ? 'orgInfo/updateStaff' : 'orgInfo/saveStaff';
    const id = staffId ? userId : null;
    const deptId = get(userInfo, 'deptId');
    const deptIds = get(userInfo, 'depts') ? get(userInfo, 'depts').map(item => item.id) : null;
    const roleIds = get(userInfo, 'roles') ? get(userInfo, 'roles').map(item => item.id) : null;
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type,
          payload: {
            deptId,
            deptIds,
            roleIds,
            ...values,
            id: staffId,
            userId: id,
            orgId: this.getId(),
          },
          callback: result => {
            const { data: res } = result;
            if (res.code === '203') {
              message.success('保存成功');
              this.setState({
                visible: false,
                staffId: null,
              });
              dispatch({
                type: 'orgInfo/fetchStaffs',
                payload: {
                  deptId: activeDeptId,
                  orgId: this.getId(),
                  type: activeKey,
                  page: pagination.current,
                },
              });
              resetFields();
            } else {
              message.error(`保存失败，${res.message}`);
            }
          },
        });
      }
    });
  };

  deptPopChange = deptPop => {
    this.setState({ deptPop });
    if (!deptPop) {
      this.setState({ deptInput: '' });
    }
  };

  editDeptPopChange = editDeptPop => {
    const { activeKeyText } = this.state;
    this.setState({ editDeptPop, deptInput: activeKeyText });
    if (!editDeptPop) {
      this.setState({ deptInput: '' });
    }
  };

  childrenDeptPopChange = childrenDeptPop => {
    this.setState({ childrenDeptPop });
    if (!childrenDeptPop) {
      this.setState({ childrenDeptInput: '' });
    }
  };

  deptInputChange = e => {
    this.setState({
      deptInput: e.target.value,
    });
  };

  chidlrenDeptInputChange = e => {
    this.setState({
      childrenDeptInput: e.target.value,
    });
  };

  saveDept = (isChild, isEdit) => {
    const { dispatch } = this.props;
    const { deptInput, activeDeptId, childrenDeptInput, parentId } = this.state;
    const payload = { name: deptInput, parentId: 0 };
    if (isChild) {
      payload.name = childrenDeptInput;
      payload.parentId = activeDeptId;
    }
    let type = 'orgInfo/saveDept';
    if (isEdit) {
      type = 'orgInfo/updateDept';
      payload.id = activeDeptId;
      payload.parentId = parentId;
    }
    payload.orgId = this.getId();
    dispatch({
      type,
      payload,
      callback: result => {
        const { data: res } = result;
        if (res.code === '203') {
          message.success('保存成功');
          dispatch({
            type: 'orgInfo/fetchDepts',
            payload: { parentId: 0, orgId: this.getId() },
          });
          this.setState({
            deptPop: false,
            childrenDeptPop: false,
            editDeptPop: false,
            deptInput: '',
          });
        } else {
          message.error(`保存失败，${res.message}`);
        }
      },
    });
  };

  delDept = () => {
    const {
      dispatch,
      orgInfo: {
        staffs: { pagination },
      },
    } = this.props;
    const { activeDeptId, activeKey } = this.state;
    dispatch({
      type: 'orgInfo/delDept',
      payload: { id: activeDeptId, orgId: this.getId() },
      callback: result => {
        const { data: res } = result;
        if (res.code === '203') {
          message.success('删除成功');
          dispatch({
            type: 'orgInfo/fetchDepts',
            payload: { parentId: 0, orgId: this.getId() },
          });
          this.setState({
            activeDeptId: null,
            activeKey: 'allStaff',
            activeKeyText: '所有人员',
          });
          dispatch({
            type: 'orgInfo/fetchStaffs',
            payload: { orgId: this.getId(), type: activeKey, page: pagination.current },
          });
        } else {
          message.error(`删除失败，${res.message}`);
        }
      },
    });
  };

  deptClick = dept => {
    const { dispatch } = this.props;
    const name = get(dept, 'name');
    const id = get(dept, 'id');
    const parentId = get(dept, 'parent.id');
    this.setState({
      activeKey: undefined,
      activeDeptId: String(id),
      activeKeyText: name,
      parentId,
    });
    dispatch({
      type: 'orgInfo/fetchStaffs',
      payload: { deptId: id, orgId: this.getId(), page: 1 },
    });
  };

  subMenuClick = dept => {
    const { dispatch } = this.props;
    const name = get(dept, 'name');
    const id = get(dept, 'id');
    const parentId = get(dept, 'parent.id');
    this.setState({
      activeKey: undefined,
      activeDeptId: String(id),
      activeKeyText: name,
      parentId,
    });
    dispatch({
      type: 'orgInfo/fetchStaffs',
      payload: { deptId: id, orgId: this.getId() },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {
      dispatch,
      orgInfo: {
        staffs: { pagination: currentpagination },
      },
    } = this.props;
    currentpagination.current = pagination.current;
    const { formValues, activeKey } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    // this.setState({
    //   current: pagination.current,
    //   pageSize: pagination.pageSize,
    // });
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'orgInfo/fetchStaffs',
      payload: { type: activeKey, orgId: this.getId(), page: pagination.current },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  renderDeptDom = () => {
    let {
      orgInfo: { depts },
    } = this.props;
    if (!depts) depts = [];
    const { activeDeptId } = this.state;
    const t = this;
    function mapArr(arr) {
      const dom = arr.map(item => {
        const isSelect = String(item.id) === activeDeptId;
        if (item.children) {
          return (
            <SubMenu
              key={item.id}
              className={isSelect ? styles.menuAcitve : ''}
              title={
                <a>
                  <FlagOutlined />
                  {item.name}
                </a>
              }
              onTitleClick={() => t.subMenuClick(item)}
            >
              {mapArr(item.children)}
            </SubMenu>
          );
        }
        return (
          <Menu.Item
            onClick={() => t.deptClick(item)}
            className={isSelect ? styles.menuAcitve : ''}
            key={item.id}
          >
            <FlagOutlined />
            {item.name}
          </Menu.Item>
        );
      });
      return dom;
    }

    return (
      <Menu mode="inline" defaultSelectedKeys={[activeDeptId]} style={{ width: 256 }}>
        {mapArr(depts)}
      </Menu>
    );
  };

  renderStaffMenu = () => {
    const { activeKey } = this.state;
    const dom = staffMenuEnum.map(item => {
      const isSelect = item.key === activeKey;
      return (
        <Menu.Item className={isSelect ? styles.menuAcitve : ''} key={item.key}>
          <LegacyIcon type={item.iconType} />
          {item.label}
        </Menu.Item>
      );
    });
    return (
      <Menu defaultSelectedKeys={[activeKey]} onClick={this.menuClick} style={{ width: 256 }}>
        {dom}
      </Menu>
    );
  };

  render() {
    const {
      orgInfo: {
        staffs: staffData,
        staffs: { pagination = {} },
        roles: { modelList: roleArr = [] } = {},
        stores,
        deptsEnum,
      },
      currentUser: { data: { org: { orgType } = {} } = {} } = {},
      form: { getFieldDecorator },
      submitLoading,
      staffLoading,
    } = this.props;
    // console.log(staffData);
    const {
      // userName,
      activeKeyText,
      visible,
      deptPop,
      editDeptPop,
      childrenDeptPop,
      deptInput,
      childrenDeptInput,
      activeDeptId,
      // pageSize,
      // current,
      selectedRows,
      staffId,
    } = this.state;
    // const staffData = { list: get(staffs, 'modelList') ? get(staffs, 'modelList') : [] };
    // const pagination = { total: staffs.totalCount, pageSize, current };
    // const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    // const totalStaff = staffs.totalCount ? staffs.totalCount : 0;
    const deptCanSub = deptInput.length <= 0;
    const childrenDeptCanSub = childrenDeptInput.length <= 0;
    const columns = [
      {
        title: '姓名',
        width: 75,
        dataIndex: ['user', 'realName'],
      },
      {
        title: '工号',
        dataIndex: 'jobNo',
      },
      {
        title: '部门',
        width: 120,
        dataIndex: ['dept', 'name'],
        render: text => (text ? <Badge status="processing" text={text} /> : '暂无部门'),
      },
      {
        title: '职位',
        dataIndex: 'roleName',
        render: (text, record) => {
          const { roles = [] } = record;

          const roleText = roles.map(role => role.name).join(',') || '授予角色';

          const checkCss = {
            float: 'right',
          };
          const roleDom = roleArr.map(item => {
            const checkedArr = roles.filter(i => i.id === item.id);
            const checked = checkedArr.length > 0;
            if (checked) {
              return (
                <Menu.Item
                  key={item.id}
                  onClick={() => this.changeRole(record, item.id, true)}
                  id={item.id}
                >
                  {item.name}
                  <CheckOutlined style={checkCss} />
                </Menu.Item>
              );
            }
            return (
              <Menu.Item
                key={item.id}
                onClick={() => this.changeRole(record, item.id, false)}
                id={item.id}
              >
                {item.name}
              </Menu.Item>
            );
          });
          const menu = <Menu>{roleDom}</Menu>;
          return (
            <Dropdown overlay={menu} trigger={['hover']}>
              <a className="ant-dropdown-link" href="#">
                {roleText} <DownOutlined />
              </a>
            </Dropdown>
          );
        },
      },
      {
        title: '更多',
        width: 145,
        render: (text, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <Popconfirm
                  placement="left"
                  title="确认重置？"
                  onConfirm={() => this.staffMenuClick('resetPwd', record)}
                  okText="确认"
                  cancelText="取消"
                >
                  重置密码
                </Popconfirm>
              </Menu.Item>
              <Menu.Item>
                <Popconfirm
                  placement="left"
                  title="确认删除？"
                  onConfirm={() => this.staffMenuClick('del', record)}
                  okText="确认"
                  cancelText="取消"
                >
                  删除人员
                </Popconfirm>
              </Menu.Item>
              <Menu.Item>
                <Popconfirm
                  placement="left"
                  title="确认移除？"
                  onConfirm={() => this.staffMenuClick('reFormDept', record)}
                  okText="确认"
                  cancelText="取消"
                >
                  从部门移除人员
                </Popconfirm>
              </Menu.Item>
            </Menu>
          );
          return (
            <div>
              <a onClick={() => this.updateStaff(record)}>编辑人员</a>&nbsp;|&nbsp;
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                  更多 <DownOutlined />
                </a>
              </Dropdown>
            </div>
          );
        },
      },
    ];
    return (
      <Fragment>
        <Row gutter={24}>
          <Col lg={8} md={24} className={styles.menu} style={{ borderRight: '1px solid #eee' }}>
            {
              // <Input
              //   placeholder="输入部门名称或人员名称"
              //   prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              //   suffix={suffix}
              //   value={userName}
              //   onChange={this.onChangeUserName}
              //   ref={this.userNameInput}
              // />
            }
            <div className={styles.menuTitle}>人员</div>
            {this.renderStaffMenu()}
            <Divider />
            <div className={styles.menuTitle}>
              <span>部门</span>
              <Popover
                content={
                  <div>
                    <Input
                      placeholder="输入部门名称"
                      value={deptInput}
                      onChange={this.deptInputChange}
                    />
                    <Button
                      block
                      type="primary"
                      disabled={deptCanSub}
                      onClick={() => this.saveDept(false)}
                      style={{ marginTop: 10 }}
                    >
                      添加
                    </Button>
                  </div>
                }
                title="添加部门"
                trigger="click"
                visible={deptPop}
                onVisibleChange={this.deptPopChange}
              >
                <a onClick={this.addDept} style={{ float: 'right', marginLeft: 10 }}>
                  <PlusOutlined />
                  &nbsp;添加部门
                </a>
              </Popover>
              {activeDeptId ? (
                <Popover
                  content={
                    <div>
                      <Input
                        placeholder="输入部门名称"
                        value={deptInput}
                        onChange={this.deptInputChange}
                      />
                      <Button
                        block
                        type="primary"
                        disabled={deptCanSub}
                        onClick={() => this.saveDept(false, true)}
                        style={{ marginTop: 10 }}
                      >
                        保存
                      </Button>
                    </div>
                  }
                  title="修改部门"
                  trigger="click"
                  visible={editDeptPop}
                  onVisibleChange={this.editDeptPopChange}
                >
                  <a onClick={this.addDept} style={{ float: 'right' }}>
                    <EditOutlined />
                    &nbsp;修改部门
                  </a>
                </Popover>
              ) : null}
            </div>
            {this.renderDeptDom()}
          </Col>
          <Col lg={16} md={24} className={styles.staff}>
            <div className={styles.staffHead}>
              <div className={styles.staffTitle}>
                {activeKeyText}&nbsp;·&nbsp;{pagination.total}
              </div>
              <div className={styles.actionsGroup}>
                {orgType !== 'designer' && orgType !== 'promotioner' ? (
                  <a onClick={this.addStaff}>
                    <PlusOutlined />
                    &nbsp;添加人员
                  </a>
                ) : null}
                {activeDeptId ? (
                  <Popover
                    placement="rightBottom"
                    content={
                      <div>
                        <Input
                          placeholder="输入子部门名称"
                          value={childrenDeptInput}
                          onChange={this.chidlrenDeptInputChange}
                        />
                        <div className={styles.parentDept}>隶属于：{activeKeyText}</div>
                        <Button
                          block
                          type="primary"
                          disabled={childrenDeptCanSub}
                          onClick={() => this.saveDept(true)}
                          style={{ marginTop: 10 }}
                        >
                          添加
                        </Button>
                      </div>
                    }
                    title="添加子部门"
                    trigger="click"
                    visible={childrenDeptPop}
                    onVisibleChange={this.childrenDeptPopChange}
                  >
                    <a onClick={this.addDept} style={{ float: 'right' }}>
                      <PlusOutlined />
                      &nbsp;添加子部门
                    </a>
                  </Popover>
                ) : null}
                {activeDeptId ? (
                  <Popconfirm
                    placement="left"
                    title="确认删除？"
                    onConfirm={this.delDept}
                    okText="确认"
                    cancelText="取消"
                  >
                    <a>
                      <MinusOutlined />
                      &nbsp;删除部门
                    </a>
                  </Popconfirm>
                ) : null}
              </div>
            </div>
            <StandardTable
              rowKey="id"
              needRowSelection={false}
              selectedRows={selectedRows}
              loading={staffLoading}
              data={staffData}
              pagination={pagination}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </Col>
        </Row>
        <Drawer
          title="人员信息"
          width={720}
          placement="right"
          onClose={this.onClose}
          maskClosable={false}
          visible={visible}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="工号">
                  {getFieldDecorator('jobNo', {
                    rules: [{ required: false, message: '请填写工号' }],
                  })(<Input disabled placeholder="请填写工号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="真实姓名">
                  {getFieldDecorator('realName', {
                    rules: [
                      { required: true, message: '请填写真实姓名' },
                      { validator: validatorRealName },
                    ],
                  })(<Input placeholder="输入真实姓名" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="手机号码">
                  {getFieldDecorator('mobile', {
                    rules: [
                      { required: true, message: '请填写手机号码' },
                      { validator: validatorPhone },
                    ],
                  })(<Input disabled={!!staffId} placeholder="请填写手机号码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="所属部门">
                  {getFieldDecorator('deptId', {
                    rules: [{ required: true, message: '请选择所属部门' }],
                    initialValue: activeDeptId ? String(activeDeptId) : undefined,
                  })(<DeptSelect dataSource={deptsEnum} placeholder="请选择所属部门" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="管理部门">
                  {getFieldDecorator('deptIds', {
                    rules: [{ required: false, message: '请选择管理部门' }],
                  })(
                    <DeptSelect
                      dataSource={deptsEnum}
                      placeholder="请选择管理部门"
                      mode="multiple"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            {APP_TYPE === 'site' ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="所属门店">
                    {getFieldDecorator('storeId', {
                      rules: [{ required: false, message: '请选择所属门店' }],
                    })(<BasicSelect dataSource={stores} placeholder="请选择所属门店" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="管理门店">
                    {getFieldDecorator('manageStoreIds', {
                      rules: [{ required: false, message: '请选择管理门店' }],
                    })(
                      <BasicSelect
                        dataSource={stores}
                        placeholder="请选择管理门店"
                        mode="multiple"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="所属角色">
                  {getFieldDecorator('roleIds', {
                    rules: [{ required: true, message: '请选择所属角色' }],
                  })(
                    <BasicSelect
                      mode="multiple"
                      dataSource={roleArr}
                      placeholder="请选择所属角色"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={this.onClose}
            >
              取消
            </Button>
            <Button loading={submitLoading} onClick={this.saveStaff} type="primary">
              提交
            </Button>
          </div>
        </Drawer>
      </Fragment>
    );
  }
}

export default Department;
