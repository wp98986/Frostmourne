import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Card, Input, Button, Modal, message, Divider, TreeSelect } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SelectEnum from '@/components/SelectEnum';
import { getListSorter } from '@/utils/utils';
import { getPages } from '@/utils/pageHelper';
import functionConstant from '@/constants/functionConstant';
import styles from './Function.less';
import AuthSelect from './AuthSelect';
import FunctionUpdateForm from './FunctionUpdateForm';

import getFunctionDocType from './functionCommon';

const { functionSite } = functionConstant;
const { SHOW_PARENT } = TreeSelect;
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ functionmodel, loading }) => ({
  functionmodel,
  loading: loading.models.functionmodel,
}))
@Form.create()
class FunctionList extends PureComponent {
  state = {
    updateModalVisible: false,
    expandForm: false,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'functionmodel/fetch',
    });
    this.fetchAuth();
  }

  fetchAuth = portType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'functionmodel/fetchAuth',
      payload: { portType },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const functionSorts = getListSorter(sorter);

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      functionSorts,
      ...formValues,
      ...filters,
    };

    dispatch({
      type: 'functionmodel/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'functionmodel/fetch',
        payload: { ...values },
      });
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    const id = get(record, 'id');
    dispatch({
      type: 'functionmodel/fetchCurrent',
      payload: { id },
      callback: data => {
        if (JSON.stringify(data) !== '{}') {
          this.setState({
            updateModalVisible: !!flag,
          });
        }
      },
    });
    const portType = get(record, 'portType');
    this.fetchAuth(portType);
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'functionmodel/remove',
      payload: { id },
      callback: result => {
        const { data: res } = result;
        if (res.code === '203') {
          message.success('删除成功');
          dispatch({
            type: 'functionmodel/fetch',
          });
        } else {
          message.error(`删除失败，${res.message}`);
        }
      },
    });
  };

  handleDelete = record => {
    Modal.confirm({
      title: '删除功能模块',
      content: '确定删除该功能模块吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(record.id),
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id, ...others } = fields;
    dispatch({
      type: id ? 'functionmodel/update' : 'functionmodel/add',
      payload: { id, ...others },
      callback: response => {
        const {
          data: { message: errorMessage },
        } = response;
        message.success(errorMessage);
      },
    });

    this.handleUpdateModalVisible();
  };

  handleSiteChange = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      pages: null,
      docType: null,
    });
    this.setState({
      portType: value,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      functionmodel: {
        data: { authList },
      },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="权限">
              {getFieldDecorator('auths')(<AuthSelect data={authList} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <DownOutlined />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      functionmodel: {
        data: { authList },
      },
    } = this.props;

    const { portType } = this.state;

    // pages
    const pageTree = getPages(portType);

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="权限">
              {getFieldDecorator('auths')(<AuthSelect data={authList} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="排序号">
              {getFieldDecorator('code')(<Input placeholder="请输入排序号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="端口">
              {getFieldDecorator('portType')(
                <SelectEnum
                  data={functionSite}
                  onChange={this.handleSiteChange}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="页面">
              {getFieldDecorator('pages')(
                <TreeSelect
                  treeData={pageTree}
                  treeCheckable
                  showCheckedStrategy={SHOW_PARENT}
                  treeNodeFilterProp="title"
                  searchPlaceholder={!portType ? '请先选择端口' : '请选择'}
                  disabled={!portType}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('docType')(
                <SelectEnum
                  data={getFunctionDocType(portType)}
                  placeholder={portType ? '请选择' : '请先选择端口'}
                  disabled={!portType}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <UpOutlined />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      functionmodel: { data },
      loading,
    } = this.props;
    const { updateModalVisible } = this.state;
    const { list, pagination, authList } = data;
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    let modelData = get(data, 'model');
    if (!modelData) modelData = {};
    const columns = [
      {
        title: '模块名称',
        dataIndex: 'name',
        sorter: true,
        sortField: 'name',
      },
      {
        title: '模块类型',
        dataIndex: 'doc_type',
        sorter: true,
        sortField: 'doc_type',
        render: (text, { portType, docType }) => {
          const functionDocType = getFunctionDocType(portType);
          return functionDocType.getLabel(docType);
        },
      },
      {
        title: '排序号',
        dataIndex: 'code',
        sorter: true,
        sortField: 'code',
      },
      {
        title: '端口',
        dataIndex: 'portType',
        render: val => functionSite.getLabel(val),
      },
      {
        title: '帮助说明',
        dataIndex: 'helpRemark',
      },
      {
        title: '最后修改时间',
        dataIndex: 'lastModifyDate',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="功能模块列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => this.handleUpdateModalVisible(true)}
              >
                新建
              </Button>
            </div>
            <StandardTable
              rowKey="id"
              needRowSelection={false}
              loading={loading}
              data={{ list, pagination }}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {updateModalVisible ? (
          <FunctionUpdateForm
            {...updateMethods}
            fetchAuth={this.fetchAuth}
            updateModalVisible={updateModalVisible}
            values={modelData}
            authList={authList}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default FunctionList;
