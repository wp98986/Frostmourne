import React, { Component } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button } from 'antd';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    const { fileList } = props;
    this.state = {
      fileList: fileList || [],
      canRec: true,
    };
  }

  setFileList = data => {
    this.setState({
      fileList: data,
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
    const { onChange } = this.props;
    if (onChange) {
      onChange(newData);
    }
    this.setState({ fileList });
  };

  UNSAFE_componentWillReceiveProps() {
    const { canRec } = this.state;
    const { initialValue } = this.props;
    if (initialValue && canRec) {
      this.setState({
        fileList: initialValue,
        canRec: false,
      });
    }
  }

  render() {
    const { fileList } = this.state;
    const { limit } = this.props;
    const uploadButton = (
      <Button>
        <UploadOutlined /> Select File
      </Button>
    );

    let appType = APP_TYPE;
    if (appType === 'frontsite') appType = 'site';
    const uploadConfig = {
      action: `/${appType}/uploadFile`,
    };
    return (
      <div className="clearfix">
        <Upload
          {...uploadConfig}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= limit ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}

export default FileUpload;
