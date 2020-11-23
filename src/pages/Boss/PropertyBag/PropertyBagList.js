import React, { PureComponent } from 'react';
import { connect, history } from 'umi';

import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Card, Input, Button, Modal, message, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SelectEnum from '@/components/SelectEnum';
import PropertyBagConstant from '@/constants/PropertyBagConstant';
import { getListSorter } from '@/utils/utils';

import styles from './PropertyBag.less';

const { typeEnum } = PropertyBagConstant;
const { Option } = Select;
const confirm = Modal.confirm;

const VIEW_PATH = '/setting/propertybag/view/';
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint no-undef:0 */
@connect(({ propertybag, loading }) => ({
  propertybag,
  loading: loading.models.propertybag,
}))
@Form.create()
class PropertyBagList extends PureComponent {
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
      type: 'propertybag/fetchList',
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

    const propertybagSorts = getListSorter(sorter);

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      propertybagSorts,
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
      type: 'propertybag/fetchList',
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
      type: 'propertybag/fetchList',
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
        type: 'propertybag/fetchList',
        payload: values,
      });
    });
  };

  toAdd = () => {
    history.push('/setting/propertybag/add');
  };

  toView = id => {
    history.push(VIEW_PATH + id);
  };

  del = id => {
    const { dispatch } = this.props;
    confirm({
      title: '确认',
      content: '请确认删除该客户',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'propertybag/delete',
          payload: { id },
          callback: result => {
            const { data } = result;
            if (data.code === '203') {
              message.success('删除成功');
              dispatch({
                type: 'propertybag/fetchList',
                payload: {},
              });
            } else {
              let msg = '';
              if (data.message) msg = `，${data.message}`;
              message.error(`删除失败${msg}`);
            }
          },
        });
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const yes = true;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="属性包名/编码">
              {getFieldDecorator('nameCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('types')(
                <SelectEnum data={typeEnum} mode="multiple" placeholder="选择类型" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否有效">
              {getFieldDecorator('isValid')(
                <Select placeholder="请选择">
                  <Option value={yes}>是</Option>
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
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const { propertybag, loading } = this.props;
    const { selectedRows, pageSize, current } = this.state;
    let data = { list: [] };
    let pagination = {};
    if (propertybag.list) {
      data = { list: propertybag.list.modelList };
      pagination = { total: propertybag.list.totalCount, pageSize, current };
    }
    const columns = [
      {
        title: '操作',
        dataIndex: 'cation',
        render: (text, record) => <a onClick={() => this.toView(record.id)}>查看</a>,
      },
      {
        title: '属性包名',
        dataIndex: 'name',
        sorter: true,
        sortField: 'name',
      },
      {
        title: '编码',
        dataIndex: 'code',
        sorter: true,
        sortField: 'code',
      },
      {
        title: '是否有效',
        dataIndex: 'isValid',
        render: val => (val ? '是' : '否'),
      },
      {
        title: '创建时间',
        dataIndex: 'createdate',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
    ];
    return (
      <PageHeaderWrapper title="属性包列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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

export default PropertyBagList;
