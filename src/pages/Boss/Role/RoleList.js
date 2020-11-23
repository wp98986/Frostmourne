import React, { PureComponent } from 'react';
import { connect, history } from 'umi';

import moment from 'moment';
import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Card, Input, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import SelectEnum from '@/components/SelectEnum';
// import FunctionsSelect from '@/components/FunctionsSelect';
import AppSelect from '@/components/AppSelect';
import { getListSorter } from '@/utils/utils';
// import functionConstant from '@/constants/functionConstant';

import styles from './Role.less';

// const { functionSite } = functionConstant;
const VIEW_PATH = '/setting/role/view/';
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint no-undef:0 */
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class RoleList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    pageSize: 10,
    current: 1,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fecthApps',
      payload: {},
    });
    dispatch({
      type: 'role/fetchList',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const roleSorts = getListSorter(sorter);

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      roleSorts,
      ...formValues,
      ...filters,
    };
    this.setState({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'role/fetchList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      current: 1,
    });
    dispatch({
      type: 'role/fetchList',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'role/fetchList',
        payload: values,
      });
    });
  };

  handleSiteChange = value => {
    const { formValues } = this.state;
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      functionIds: undefined,
      appId: undefined,
    });
    this.setState({
      formValues: { ...formValues, site: value },
    });
  };

  toAdd = () => {
    history.push('/setting/role/add');
  };

  toView = id => {
    history.push(VIEW_PATH + id);
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
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
      role: { apps },
    } = this.props;
    // const { formValues } = this.state;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {
            // <Col md={8} sm={24}>
            //   <FormItem label="端口">
            //     {getFieldDecorator('site')(
            //       <SelectEnum
            //         data={functionSite}
            //         placeholder="请选择端口"
            //         onChange={this.handleSiteChange}
            //         style={{ width: '100%' }}
            //       />
            //     )}
            //   </FormItem>
            // </Col>
          }
          <Col md={8} sm={24}>
            <FormItem label="应用">
              {getFieldDecorator('appId')(
                <AppSelect
                  dataSource={apps}
                  allowClear
                  // placeholder={!formValues.site ? '请先选择端口' : '请选择'}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="排序号">
              {getFieldDecorator('code')(<Input placeholder="请输入排序号" />)}
            </FormItem>
          </Col>
        </Row>
        {
          // <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          // <Col md={8} sm={24}>
          //   <FormItem label="功能模块">
          //     {getFieldDecorator('functionIds')(
          //       <FunctionsSelect
          //         mode="multiple"
          //         allowClear
          //         site={formValues.site}
          //         placeholder='请选择'
          //         // disabled={!formValues.site}
          //         style={{ width: '100%' }}
          //       />
          //     )}
          //   </FormItem>
          // </Col>
          // </Row>
        }
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
    const { role, loading } = this.props;
    const { selectedRows, pageSize, current } = this.state;
    const data = { list: role.list.modelList };
    const pagination = { total: role.list.totalCount, pageSize, current };
    const columns = [
      {
        title: '操作',
        dataIndex: 'cation',
        render: (text, record) => <a onClick={() => this.toView(record.id)}>查看</a>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        sorter: true,
        sortField: 'name',
      },
      {
        title: '排序字段',
        dataIndex: 'code',
        sorter: true,
        sortField: 'code',
      },
      {
        title: '所属应用',
        dataIndex: 'appName',
        render: (text, record) => {
          const appName = get(record, 'app.name');
          return appName;
        },
      },
      {
        title: '最后修改时间',
        dataIndex: 'lastModifyDate',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];
    return (
      <PageHeaderWrapper title="角色列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon={<PlusOutlined />} type="primary" onClick={this.toAdd}>
                新建
              </Button>
            </div>
            <StandardTable
              needRowSelection={false}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              pagination={pagination}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
