import React, { Component } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Button, Modal, Progress, message } from 'antd';
import StandardTable from '@/components/StandardTable';
import Constant from './Constant';

import styles from './index.less';

const { statusEnum } = Constant;

@connect(({ download: { exportList: { list, pagination }, exportModalVisible }, loading }) => ({
  list,
  pagination,
  exportModalVisible,
  loading: loading.effects['download/fetchList'] || false,
}))
class ExportDownload extends Component {
  state = {
    canLoad: true,
  };

  loadList = page => {
    const { dispatch, downType } = this.props;
    clearInterval(this.interval);
    dispatch({
      type: 'download/fetchList',
      payload: { downType, page: page || 1 },
      callback: result => {
        let continueLoad = false;
        for (let i = 0; i < result.length; i++) {
          const { status } = result[i];
          if (status === 'executing') {
            continueLoad = true;
          }
        }
        if (continueLoad) {
          this.continueLoadList();
        }
      },
    });
  };

  continueLoadList = () => {
    const context = this;
    this.interval = setInterval(() => {
      const {
        dispatch,
        downType,
        pagination: { page },
      } = this.props;
      dispatch({
        type: 'download/fetchList',
        payload: { downType, page },
        callback: result => {
          let continueLoad = false;
          for (let i = 0; i < result.length; i++) {
            const { status } = result[i];
            if (status === 'executing') {
              continueLoad = true;
            }
          }
          if (!continueLoad) {
            clearInterval(context.interval);
          }
        },
      });
    }, 3000);
  };

  closeExport = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'download/toggleExportModal',
      payload: { exportModalVisible: false },
    });
    this.setState({
      canLoad: true,
    });
  };

  addDownLoad = () => {
    const { addDownLoadCallBack } = this.props;
    if (addDownLoadCallBack) {
      addDownLoadCallBack(this.loadList);
    }
  };

  downLoadFile = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'download/downLoadFile',
      payload: { id },
      callback: result => {
        const { data } = result || {};
        window.open(data);
      },
    });
  };

  cancelDownLoad = id => {
    const { dispatch } = this.props;
    const context = this;
    Modal.confirm({
      title: '确认取消导出？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'download/cancelFile',
          payload: { id },
          callback: result => {
            const {
              data: { code, message: returnMessage },
            } = result;
            if (code === '203') {
              message.success('操作成功');
              context.loadList(1);
            } else {
              message.error(`操作失败${returnMessage}`);
            }
          },
        });
      },
    });
  };

  delFile = id => {
    const { dispatch } = this.props;
    const context = this;
    Modal.confirm({
      title: '确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'download/delFile',
          payload: { id },
          callback: result => {
            const {
              data: { code, message: returnMessage },
            } = result;
            if (code === '203') {
              message.success('操作成功');
              context.loadList(1);
            } else {
              message.error(`操作失败${returnMessage}`);
            }
          },
        });
      },
    });
  };

  handleStandardTableChange = pagination => {
    clearInterval(this.interval);
    const { current } = pagination;
    this.loadList(current);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { canLoad } = this.state;
    const { exportModalVisible } = nextProps;
    if (exportModalVisible && canLoad) {
      this.loadList(1);
      this.setState({
        canLoad: false,
      });
    }
  }

  render() {
    const { exportModalVisible, list, pagination } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '下载进度',
        dataIndex: 'progress',
        width: 250,
        render: (text, record) => {
          const { status } = record;
          if (status === 'success' || status === 'executing') {
            return <Progress percent={parseFloat((text * 100).toFixed(2))} />;
          }
          if (status === 'fail' || status === 'cancel') {
            return <Progress percent={parseFloat((text * 100).toFixed(2))} status="exception" />;
          }
          return <div />;
        },
      },

      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: text => statusEnum.getLabel(text),
      },
      {
        title: '创建时间',
        dataIndex: 'createdate',
        width: 200,
        render: text => (text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : <div />),
      },
      {
        title: '操作',
        width: 140,
        dataIndex: 'id',
        render: (text, record) => {
          const { status } = record;
          if (status === 'executing') {
            return (
              <div className={styles.aherfBox}>
                <a rel="noopener noreferrer" onClick={() => this.cancelDownLoad(text)}>
                  取消
                </a>
              </div>
            );
          }
          if (status === 'success') {
            return (
              <div className={styles.aherfBox}>
                <a rel="noopener noreferrer" onClick={() => this.downLoadFile(text)}>
                  下载
                </a>
                <a rel="noopener noreferrer" onClick={() => this.delFile(text)}>
                  删除
                </a>
              </div>
            );
          }
          if (status === 'cancel' || status === 'fail') {
            return (
              <div className={styles.aherfBox}>
                <a rel="noopener noreferrer" onClick={() => this.delFile(text)}>
                  删除
                </a>
              </div>
            );
          }
          return null;
        },
      },
    ];
    return (
      <Modal
        width={1000}
        style={{ top: 20 }}
        title="导出列表"
        maskClosable={false}
        visible={exportModalVisible}
        footer={[<Button onClick={this.closeExport}>关闭</Button>]}
        onCancel={() => this.closeExport()}
      >
        <Button onClick={() => this.addDownLoad()}>新增任务</Button>
        <StandardTable
          needRowSelection={false}
          rowKey={record => record.id}
          data={{ list, pagination }}
          pagination={{ ...pagination, current: pagination.page }}
          columns={columns}
          onChange={this.handleStandardTableChange}
        />
      </Modal>
    );
  }
}

export default ExportDownload;
