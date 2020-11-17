import React, { PureComponent } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Card, Button, Popover, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './TableForm';
import styles from './CommonPropertyBag.less';

const fieldLabels = {
  name: '标签名',
  code: '编码',
  type: '类型',
  enableFlag: '是否有效',
  remark: '备注',
};

@Form.create()
class CommonPropertyBag extends PureComponent {
  constructor(props) {
    super(props);
    const { data } = props;
    this.state = {
      data,
    };
    this.isScrollTop = true;
  }

  static getDerivedStateFromProps(nextProps) {
    if ('data' in nextProps && nextProps.data) {
      return { data: nextProps.data };
    }
    return null;
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <LegacyIcon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <ExclamationCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const { okHandle, type } = this.props;
    const datas = this.form.getFormValue();
    let canSave = true;
    if (type !== 'single' && type !== 'product') {
      datas.map(item => {
        if (!item.type) {
          message.error('请填写完整属性信息');
          canSave = false;
        } else if (item.type) {
          if (item.type === 'input') {
            if (!item.name) {
              message.error('请填写完整属性信息');
              canSave = false;
            }
          } else if (item.type !== 'input') {
            if (!item.name || !item.optionValue) {
              message.error('请填写完整属性信息');
              canSave = false;
            }
          }
        }
        return item;
      });
    } else {
      canSave = datas.length > 0;
    }
    if (!canSave) {
      return;
    }
    if (okHandle) {
      okHandle(datas);
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      title = '',
      type,
    } = this.props;
    const { width, data = {} } = this.state;
    const { propertys = [], remark = '', optionValue = '' } = data;
    let keyData = [];
    if (type === 'single') {
      const values = optionValue.split(',');
      keyData = values.map(item => {
        const obj = { value: item };
        return obj;
      });
    } else {
      keyData = propertys.map((item, index) => {
        const newItem = { ...item, key: index + 1 };
        return newItem;
      });
    }
    return (
      <PageHeaderWrapper
        title={title}
        content={`备注：${remark}`}
        wrapperClassName={styles.advancedForm}
      >
        <Card title="属性" bordered={false}>
          {getFieldDecorator('propertys', {
            initialValue: keyData,
          })(
            <TableForm
              {...this.props}
              ref={form => {
                this.form = form;
              }}
            />
          )}
        </Card>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default CommonPropertyBag;
