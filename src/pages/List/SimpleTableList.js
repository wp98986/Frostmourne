import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Card, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import AreaSelect from '@/components/AreaSelect';
import LeaderOrgSelect from '@/components/LeaderOrgSelect';
import StaffSelect from '@/components/StaffSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import { getAddressStr } from '@/utils/utils';

import styles from './SimpleTableList.less';

const VIEW_PATH = '/org/view/';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ org, loading }) => ({
  org,
  loading: loading.models.org,
}))
@Form.create()
class SimpleTableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '操作',
      dataIndex: 'cation',
      render: (text, record) => (
        <a href={VIEW_PATH + record.id} target="_blank" rel="noopener noreferrer">
          查看
        </a>
      ),
    },
    {
      title: '组织代码',
      dataIndex: 'orgCode',
    },
    {
      title: '组织名称',
      dataIndex: 'orgName',
    },
    {
      title: '区域',
      dataIndex: 'area',
      // render: (text, record) => {
      //   const addr = getAddressStr(get(record, 'addressModel'), 0, 2);
      //   return addr;
      // },
    },
    {
      title: '详细地址',
      dataIndex: 'desc',
    },
    {
      title: '联系人',
      dataIndex: 'callNo',
    },
    {
      title: '联系电话',
      dataIndex: 'status',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'org/fetchList',
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

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'org/fetchList',
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
      type: 'org/fetchList',
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
        type: 'org/fetchList',
        payload: values,
      });
    });
  };

  handleModalVisible = () => {
    // this.setState({
    //   modalVisible: !!flag,
    // });
    router.push('/boss/org/edit');
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="组织名称">
              {getFieldDecorator('orgName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="组织编码">
              {getFieldDecorator('orgCode')(<Input placeholder="请输入" />)}
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
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="组织名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="组织编码">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status3')(
                <Select placeholder="选择状态" mode="multiple" style={{ width: '100%' }}>
                  <Option value>有效</Option>
                  <Option value={false}>运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="区域">
              {getFieldDecorator('area')(
                <AreaSelect style={{ width: '100%' }} placeholder="请选择区域" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="上级单位">
              {getFieldDecorator('belongOrgId')(
                <LeaderOrgSelect placeholder="请选择上级单位" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="业务开拓">
              {getFieldDecorator('status4')(
                <StaffSelect placeholder="请选择业务开拓" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('contact')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('phoneNo')(<Input placeholder="请输入" />)}
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
    const { org, loading } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="企业列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {
                // <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                //   新建
                // </Button>
              }
            </div>
            <StandardTable
              needRowSelection={false}
              selectedRows={selectedRows}
              loading={loading}
              data={org}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SimpleTableList;
