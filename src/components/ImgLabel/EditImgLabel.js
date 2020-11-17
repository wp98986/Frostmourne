import React, { Component } from 'react';
import { EditOutlined, SwapOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Popover, Input, Select } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const Option = Select.Option;
const swapWidth = 18;
const labelHeight = 24;
@Form.create()
class EditLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    const { width } = this.state;
    if (this.container) {
      // 元素宽度改变时，触发二次渲染
      const { offsetWidth } = this.container;
      if (width !== offsetWidth) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ width: offsetWidth });
        setTimeout(() => {
          const { pointX, pointY, onChange, direction, uKey } = this.props;
          const newPoint = this.normizePoint({ pointX, pointY, direction });
          if (onChange) {
            onChange({ uKey, ...newPoint });
          }
        }, 100);
      }
    }
  }

  onMouseDown = ev => {
    ev.stopPropagation();
    const { clientX, clientY } = ev;
    this.lastX = clientX;
    this.lastY = clientY;
    this.last = new Date();
    document.onmouseup = e => this.onMouseUp(e);
    document.onmousemove = e => {
      // 函数节流
      const now = new Date();
      if (now - this.last > 40) {
        this.last = now;
        this.onMove(e);
      }
    };
  };

  onMouseUp() {
    clearTimeout(this.timeout);
    this.lastX = null;
    this.lastY = null;
    document.onmouseup = null;
    document.onmousemove = null;
  }

  onMove(e) {
    const { onChange, pointX = 0, pointY = 0, direction, uKey } = this.props;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const { pointX: newPointX, pointY: newPointY } = this.normizePoint({
      pointX: pointX + dx,
      pointY: pointY + dy,
      direction,
    });

    if (onChange) {
      onChange({ pointX: newPointX, pointY: newPointY, uKey });
    }

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  getLayout() {
    const { width = 0 } = this.state;
    return { width };
  }

  changeDirection = () => {
    const { pointX, pointY, onChange, direction, uKey } = this.props;
    const newDirection = direction === 'left' ? 'right' : 'left';
    const newPoint = this.normizePoint({ pointX, pointY, direction: newDirection });
    if (onChange) {
      onChange({ uKey, direction: newDirection, ...newPoint });
    }
  };

  delLabels = () => {
    const { onChange, uKey } = this.props;
    if (onChange) {
      onChange({ uKey, isDelete: true });
    }
  };

  close = () => {
    const { form, uKey, onChange } = this.props;
    if (onChange) {
      onChange({ uKey, visible: false });
    }
    form.resetFields();
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      form,
      onChange,
      uKey,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      const { name, labelType, labelId } = values;
      if (onChange) {
        onChange({ name, labelType, labelId, uKey, visible: false });
      }
      form.resetFields();
    });
  };

  renderContent = (name, labelType, labelId) => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 7 },
        sm: { span: 7 },
        md: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 17 },
        sm: { span: 17 },
        md: { span: 17 },
      },
    };
    return (
      <div>
        <Form hideRequiredMark>
          <Form.Item {...formItemLayout} label="标签名称">
            {getFieldDecorator('name', {
              initialValue: name,
            })(<Input placeholder="请输入标签名称" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="标签类型">
            {getFieldDecorator('labelType', {
              initialValue: labelType,
            })(
              <Select placeholder="请选择标签类型">
                <Option value="design">套餐</Option>
                <Option value="product">单品</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="ID">
            {getFieldDecorator('labelId', {
              initialValue: labelId,
            })(<Input placeholder="请输入ID" />)}
          </Form.Item>
        </Form>
        <div className={styles.buttonBox}>
          <Button type="danger" ghost onClick={() => this.delLabels()} style={{ marginRight: 10 }}>
            删除
          </Button>
          <Button onClick={() => this.close()} style={{ marginRight: 10 }}>
            取消
          </Button>
          <Button type="primary" onClick={() => this.validate()}>
            确定
          </Button>
        </div>
      </div>
    );
  };

  pathLableView = () => {
    const { noEdit, needPath, designPath, produtPath, labelType, labelId } = this.props;
    if (noEdit && needPath) {
      if (labelType === 'product' && labelId) {
        window.open(`${produtPath}${labelId}`);
      } else {
        window.open(`${designPath}${labelId}`);
      }
    }
  };

  normizePoint(label) {
    const {
      border: { margin, width: containerWidth, height: containerHeight },
    } = this.props;
    const xMin = margin;
    const xMax = containerWidth - margin;
    const yMin = margin;
    const yMax = containerHeight - margin;
    const { width } = this.getLayout();

    let { pointX, pointY } = label;
    const { direction } = label;
    if (pointY - labelHeight / 2 < yMin) {
      pointY = yMin + labelHeight / 2;
    }
    if (pointY + labelHeight / 2 > yMax) {
      pointY = yMax - labelHeight / 2;
    }
    if (direction === 'left') {
      if (pointX - swapWidth / 2 <= xMin) {
        pointX = xMin + swapWidth / 2;
      }
      if (pointX + width - swapWidth / 2 >= xMax) {
        pointX = xMax - width + swapWidth / 2;
      }
    } else {
      if (pointX - width + swapWidth / 2 < xMin) {
        pointX = xMin + width - swapWidth / 2;
      }
      if (pointX + swapWidth / 2 > xMax) {
        pointX = xMax - swapWidth / 2;
      }
    }
    return { pointX, pointY };
  }

  render() {
    const {
      pointX = 0,
      pointY = 0,
      direction,
      uKey,
      name,
      labelType,
      labelId,
      noEdit,
      visible,
      needPath,
    } = this.props;

    const { width } = this.getLayout();
    const tx = direction === 'left' ? pointX - swapWidth / 2 : pointX - width + swapWidth / 2;
    const ty = pointY - labelHeight / 2;
    const editIcon = noEdit ? null : (
      <Popover
        content={this.renderContent(name, labelType, labelId, uKey)}
        placement="bottom"
        title="标签编辑"
        trigger="click"
        visible={visible}
        onVisibleChange={value => {
          const { onChange } = this.props;
          if (onChange) {
            onChange({ uKey, visible: value });
          }
        }}
      >
        <EditOutlined className={direction === 'left' ? styles.editLeft : styles.editRight} />
      </Popover>
    );
    const point = noEdit ? (
      <div className={styles.coordinatePoints} />
    ) : (
      <SwapOutlined onClick={() => this.changeDirection()} />
    );
    const nameLable = (
      <span
        className={classNames(styles.nameBox, noEdit && needPath ? styles.nameBoxView : null)}
        onClick={this.pathLableView}
        onMouseDown={noEdit ? null : e => this.onMouseDown(e)}
      >
        {name}
      </span>
    );

    return (
      <div
        key={uKey}
        id={uKey}
        className={styles.labelBody}
        ref={r => {
          this.container = r;
        }}
        style={{
          transform: `translateX(${tx}px)translateY(${ty}px)`,
        }}
      >
        {direction === 'left' ? (
          <div className={styles.labelContent}>
            {point}
            <div className={styles.centerLine} />
            {nameLable}
          </div>
        ) : (
          <div className={styles.labelContent}>
            {nameLable}
            <div className={styles.centerLine} />
            {point}
          </div>
        )}
        {editIcon}
      </div>
    );
  }
}

export default EditLabel;
