import React, { Component } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Upload, Modal, message, Button } from 'antd';

class PhotoUpload extends Component {
  constructor(props) {
    super(props);
    const { fileList, initialValue } = props;
    const canRec = !initialValue || initialValue.length === 0;
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: fileList || initialValue || [],
      canRec,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { initialValue = [] } = nextProps;
    const { canRec } = this.state;
    if (canRec && initialValue.length !== 0) {
      this.setState({
        fileList: initialValue,
        canRec: false,
      });
    }
  }

  setFileList = data => {
    this.setState({
      fileList: data,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handlePhotoChange = list => {
    // 2. 读取远程路径并显示链接
    const newList = list.map(file => {
      const newObj = file;
      if (file.response) {
        // 组件会将 file.url 作为链接进行展示
        const url = file.response.data;
        newObj.url = url;
        newObj.origUrl = url;
      }
      return newObj;
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
    const fileList = newList.filter(file => {
      if (file.response) {
        return file.response.data;
      }
      return true;
    });
    return fileList;
  };

  handleChange = ({ fileList }) => {
    const newData = this.handlePhotoChange(fileList);
    const { onChange, validatorErr } = this.props;
    const newFileList = [];
    for (let i = 0; i < newData.length; i++) {
      const item = newData[i];
      const { size } = item;
      if (size) {
        const isLt10M = size / 1024 / 1024 < 11;
        if (!isLt10M) {
          message.error('图片大小不得超过10M！');
          if (validatorErr) {
            validatorErr('图片大小不得超过10M！');
          }
        } else {
          newFileList.push(item);
          if (validatorErr) {
            validatorErr();
          }
        }
      } else {
        newFileList.push(item);
      }
    }
    if (onChange) {
      onChange(newFileList);
    }
    this.setState({ fileList: newFileList });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { limit, placeholder = '选择图片', notImgPreview, multiple } = this.props;
    let uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">{placeholder}</div>
      </div>
    );
    if (notImgPreview) {
      uploadButton = (
        <Button type="ghost">
          <UploadOutlined /> 点击上传
        </Button>
      );
    }
    let appType = APP_TYPE;
    if (appType === 'frontsite' || appType === 'designer') appType = 'site';
    const uploadConfig = {
      action: `/${appType}/uploadImg`,
    };
    return (
      <div className="clearfix">
        <Upload
          {...uploadConfig}
          listType={notImgPreview ? null : 'picture-card'}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          multiple={multiple}
        >
          {fileList && fileList.length >= limit ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PhotoUpload;
