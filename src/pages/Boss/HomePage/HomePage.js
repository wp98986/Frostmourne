import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Input, Select, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './HomePage.less';

const FormItem = Form.Item;
const Option = Select.Option;

const HomePage = props => {
  const [form1] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const getQueryData = () => {
    // 不适用onFInish获取表单值，通过FormInstance实例获取
    const values = form1.getFieldsValue();
    const { current, pageSize } = pagination;
    return { ...values, current, pageSize };
  };

  const loadData = () => {
    const param = getQueryData();
    const { dispatch } = props;
    dispatch({
      type: 'homepageModel/fetchList',
      payload: { ...param },
    });
  };

  useEffect(() => {
    loadData();
  }, [pagination]);

  const handleStandardTableChange = pagenation => {
    setPagination({ current: pagenation.current, pageSize: pagenation.pageSize });
  };

  const searchHandle = () => {
    setPagination({ current: 1, pageSize: 10 });
  };

  const handleFormReset = () => {
    form1.resetFields();
    setPagination({ current: 1, pageSize: 10 });
  };

  const renderAdvancedForm = () => {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <Form form={form1} {...formItemLayout} name="basic">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品标题" name="goodsName">
              <Input placeholder="输入商品标题" />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品编码" name="goodsNo">
              <Input placeholder="输入商品编码" />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="厂家编码" name="supplyCode">
              <Input placeholder="输入厂家编码" />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否上架" name="goodsAdded">
              <Select style={{ width: '100%' }} placeholder="选择" allowClear>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
              </Select>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="价格标签" name="priceType">
              <Input placeholder="输入厂家编码" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xl={{ span: 4, offset: 20 }} sm={24} style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} type="primary" onClick={searchHandle}>
              查询
            </Button>
            <Button style={{ marginRight: 8 }} onClick={handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };
  const columns = [
    {
      title: '商品标题',
      dataIndex: 'goodsName',
      width: 300,
      render: text => <div style={{ wordWrap: 'break-word', width: 300 }}>{text}</div>,
    },
    // {
    //   title: '商品编码',
    //   dataIndex: 'goodsNo',
    // },
    {
      title: '品牌',
      dataIndex: ['goodsBrand', 'brandName'],
    },
    {
      title: '分类',
      dataIndex: ['goodsCategory', 'catName'],
    },
    {
      title: '上架进度',
      dataIndex: 'productAdd',
      render: (text, record) => {
        const { productAdd, productTotal } = record;
        return (
          <div style={{ color: '#00A854' }}>
            {productAdd}/{productTotal}
          </div>
        );
      },
    },
  ];
  const { tableLoading, dataList } = props;
  return (
    <PageHeaderWrapper title="商品列表">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm} style={{ marginBottom: 24 }}>
            {renderAdvancedForm()}
          </div>
        </div>
      </Card>
      <StandardTable
        needRowSelection={false}
        rowKey="id"
        loading={tableLoading}
        data={dataList}
        columns={columns}
        onChange={handleStandardTableChange}
        scroll={{ x: 1300 }}
      />
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ homepageModel = {}, loading }) => {
  const tableLoading = loading.effects['homepageModel/fetchList'];
  return {
    ...homepageModel,
    tableLoading,
  };
};
export default connect(mapStateToProps)(HomePage);
