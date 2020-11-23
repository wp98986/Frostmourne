import React, { PureComponent } from 'react';
import { connect, history } from 'umi';

import moment from 'moment';
import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Card, Input, Select, Button, Badge } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SelectEnum from '@/components/SelectEnum';
import functionConstant from '@/constants/functionConstant';
import { getListSorter } from '@/utils/utils';
import AppConstant from './AppConstant';

import styles from './App.less';

const { functionSite } = functionConstant;
const { typeEnum } = AppConstant;
const VIEW_PATH = '/setting/app/view/';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint no-undef:0 */
@connect(({ app, loading }) => ({
  app,
  loading: loading.models.app,
}))
@Form.create()
class AppList extends PureComponent {
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
      type: 'app/fetchList',
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

    const appSorts = getListSorter(sorter);

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      appSorts,
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
      type: 'app/fetchList',
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
      type: 'app/fetchList',
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
        type: 'app/fetchList',
        payload: values,
      });
    });
  };

  toAdd = () => {
    history.push('/setting/app/add');
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
            <FormItem label="端口">
              {getFieldDecorator('portType')(
                <SelectEnum
                  data={functionSite}
                  placeholder="请选择端口"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <SelectEnum data={typeEnum} placeholder="请选择类型" style={{ width: '100%' }} />
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
              展开 <DownOutlined />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderAdvancedForm() {
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
            <FormItem label="端口">
              {getFieldDecorator('portType')(
                <SelectEnum
                  allowClear
                  data={functionSite}
                  placeholder="请选择端口"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <SelectEnum data={typeEnum} placeholder="请选择类型" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="排序号">
              {getFieldDecorator('code')(<Input placeholder="请输入排序号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否有效">
              {getFieldDecorator('enableFlags')(
                <Select placeholder="点击选择" mode="multiple" allowClear style={{ width: '100%' }}>
                  <Option value>有效</Option>
                  <Option value={false}>无效</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否默认">
              {getFieldDecorator('isDefault')(
                <Select placeholder="点击选择" allowClear style={{ width: '100%' }}>
                  <Option value>是</Option>
                  <Option value={false}>否</Option>
                </Select>
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
    const { app, loading } = this.props;
    const { selectedRows, pageSize, current } = this.state;
    const data = { list: app.list.modelList };
    const pagination = { total: app.list.totalCount, pageSize, current };
    const columns = [
      {
        title: '操作',
        dataIndex: 'cation',
        render: (text, record) => <a onClick={() => this.toView(record.id)}>查看</a>,
      },
      {
        title: '图标',
        dataIndex: 'icon',
        render: text => {
          let src = text;
          if (!src) src = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
          return <img className={styles.listLogo} src={src} alt="" />;
        },
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
        title: '端口',
        dataIndex: 'portType',
        render: text => (functionSite[text] ? functionSite[text].label : null),
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: text => (typeEnum[text] ? typeEnum[text].label : null),
      },
      {
        title: '是否有效',
        dataIndex: 'enableFlag',
        render: text => {
          const status = text ? 'processing' : 'default';
          const statusText = text ? '有效' : '无效';
          return <Badge status={status} text={statusText} />;
        },
      },
      {
        title: '是否默认',
        dataIndex: 'isDefault',
        render: text => (text ? '是' : '否'),
      },
      {
        title: '最后修改时间',
        dataIndex: 'lastModifyDate',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];
    return (
      <PageHeaderWrapper title="应用列表">
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

export default AppList;
