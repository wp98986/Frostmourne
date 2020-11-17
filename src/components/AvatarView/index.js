import React, { Component } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, message } from 'antd';

import styles from './index.less';

class AvatarView extends Component {
  static defaultProps = {
    hideCheckAll: false,
  };

  state = {
    fileList: [],
  };

  constructor(props) {
    super(props);
    const imgs = [];
    if (props.src) imgs.push(props.src);
    this.state = {
      fileList: props.src || [],
      expand: false,
      value: props.value || props.defaultValue || [],
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.value || nextProps.src) {
      return { value: nextProps.value, fileList: nextProps.src || [] };
    }
    return null;
  }

  onChange = value => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    if (onChange) {
      onChange(value);
    }
  };

  onSelectAll = checked => {
    let checkedTags = [];
    if (checked) {
      checkedTags = this.getAllTags();
    }
    this.onChange(checkedTags);
  };

  getAllTags() {
    let { children } = this.props;
    children = React.Children.toArray(children);
    const checkedTags = children
      .filter(child => this.isTagSelectOption(child))
      .map(child => child.props.value);
    return checkedTags || [];
  }

  handleTagChange = (value, checked) => {
    const { value: StateValue } = this.state;
    const checkedTags = [...StateValue];

    const index = checkedTags.indexOf(value);
    if (checked && index === -1) {
      checkedTags.push(value);
    } else if (!checked && index > -1) {
      checkedTags.splice(index, 1);
    }
    this.onChange(checkedTags);
  };

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  };

  isTagSelectOption = node =>
    node &&
    node.type &&
    (node.type.isTagSelectOption || node.type.displayName === 'TagSelectOption');

  handleChange = ({ file }) => {
    const { onChange } = this.props;
    const response = get(file, 'response');
    const fileList = get(response, 'data');
    if (response) {
      this.setState({ fileList });
      if (onChange) onChange(fileList);
    }
  };

  getData = () => {
    const { fileList } = this.state;
    return fileList;
  };

  beforeUpload = file => {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //   message.error('您必须上传JPG/JPEG图片');
    // }
    const isLt = file.size / 1024 / 1024 < 0.5;
    if (!isLt) {
      message.error('您必须上传文件大小小于500kb的图片');
    }
    return isLt;
  };

  render() {
    let { title } = this.props;
    if (!title) title = '更换头像';
    const { fileList } = this.state;
    // const data = {};
    // data.token = localStorage.getItem('AgcyPlat.token');
    let type = APP_TYPE;
    if (APP_TYPE === 'designer') type = 'site';
    const uploadConfig = {
      // data,
      action: `/${type}/uploadImg`,
      showUploadList: false,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
    };
    return (
      <div>
        {
          // <div className={styles.avatar_title}>
          //   <span>{title}</span>
          // </div>
        }
        <div className={styles.avatar}>
          <img src={fileList} alt="avatar" />
        </div>
        <div>
          <Upload {...uploadConfig}>
            <div className={styles.button_view}>
              <Button icon={<UploadOutlined />}>{title}</Button>
            </div>
          </Upload>
        </div>
      </div>
    );
  }
}

export default AvatarView;
