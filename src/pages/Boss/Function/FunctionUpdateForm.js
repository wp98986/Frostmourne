import React, { PureComponent } from 'react';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Col, Button, Input, Steps, TreeSelect, Row, Modal } from 'antd';

import SelectEnum from '@/components/SelectEnum';

import functionConstant from '@/constants/functionConstant';
import { getPages } from '@/utils/pageHelper';

import PageTableForm from './PageTableForm';
import AuthSelect from './AuthSelect';
import getFunctionDocType from './functionCommon';

const { functionSite } = functionConstant;
const { SHOW_CHILD } = TreeSelect;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;

function searchPage(site, value, p) {
  const pages = p || getPages(site);
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.value === value) {
      return page;
    }
    if (page.children && page.children.length > 0) {
      const target = searchPage(site, value, page.children);
      if (target) return target;
    }
  }
  return null;
}

@Form.create()
class FunctionUpdateForm extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   const {
  //     values: { functionPages = [], portType, ...others },
  //   } = this.props;
  //   let pages = functionPages;
  //   if(!pages) pages = []
  //   const newPages = pages.map(p => p.page);
  //   const buttons = pages
  //     .map(({ p, btns }) => {
  //       const target = searchPage(portType, p) || {};
  //       const { title, value, btns: btnDatas } = target;
  //       if (!btnDatas) return null;
  //       return { title, value, btnDatas, btns };
  //     })
  //     .filter(item => item);
  //   this.state = {
  //     formVals: { ...others, portType, functionPages: newPages, buttons },
  //     currentStep: 0,
  //   };
  // }
  state = {
    formVals: {},
  };

  UNSAFE_componentWillMount() {
    const { values } = this.props;
    if (JSON.stringify(values) !== '{}') {
      const { functionPages = [], portType, ...others } = values;
      let pages = functionPages;
      if (!pages) pages = [];
      const newPages = pages.map(p => p.page);
      const buttons = pages
        .map(({ page, buttons: btns }) => {
          const target = searchPage(portType, page) || {};
          const { title, value, btns: btnDatas } = target;
          if (!btnDatas) return null;
          return { title, value, btnDatas, btns };
        })
        .filter(item => item);
      this.setState({
        formVals: { ...others, portType, functionPages: newPages, buttons },
        currentStep: 0,
      });
    }
    this.setState({
      currentStep: 0,
    });
  }

  process = formVals => {
    const { functionPages = [], buttons = [], ...others } = formVals;
    const newPage = functionPages.map(page => {
      const selectedPageBtn = buttons.find(pageBtn => pageBtn.value === page) || {};
      const { btns } = selectedPageBtn;
      return {
        page,
        buttons: btns,
      };
    });
    return { ...others, functionPages: newPage };
  };

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 1) {
            this.forward();
          } else {
            handleUpdate(this.process(formVals));
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  handlePageChange = values => {
    const {
      formVals: { portType, buttons = [], ...others },
    } = this.state;
    const data = [];
    for (let i = 0; i < values.length; i++) {
      const page = searchPage(portType, values[i]) || {};
      // console.log(page);
      const { title, value, btns } = page;
      const pageBtn = buttons.find(pb => pb.value === value);
      if (pageBtn) {
        data.push(pageBtn);
      } else if (btns) {
        data.push({
          title,
          value,
          btnDatas: btns, // 按钮可选范围
        });
      }
    }

    this.setState({
      formVals: { portType, buttons: data, ...others },
    });
  };

  handleSiteChange = value => {
    const { formVals } = this.state;
    const { fetchAuth } = this.props;
    if (typeof fetchAuth === 'function') {
      fetchAuth(value);
    }
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      docType: null,
    });
    this.setState({
      formVals: { ...formVals, portType: value },
    });
  };

  renderBase = formVals => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };

    return [
      <FormItem key="name" {...formLayout} label="模块名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入模块名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="code" {...formLayout} label="排序号">
        {getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入排序号！' }],
          initialValue: formVals.code,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="site" {...formLayout} label="端口">
        {getFieldDecorator('portType', {
          rules: [{ required: true, message: '请选择端口！' }],
          initialValue: formVals.portType,
        })(
          <SelectEnum
            data={functionSite}
            disabled={!!formVals.id}
            onChange={this.handleSiteChange}
            placeholder="请选择"
            style={{ width: '100%' }}
          />
        )}
      </FormItem>,
      <FormItem key="docType" {...formLayout} label="模块类型">
        {getFieldDecorator('docType', {
          rules: [{ required: true, message: '请输入模块类型！' }],
          initialValue: formVals.docType,
        })(
          <SelectEnum
            data={getFunctionDocType(formVals.portType)}
            placeholder={!formVals.portType ? '请先选择端口' : '请选择'}
            disabled={!formVals.portType}
            style={{ width: '100%' }}
          />
        )}
      </FormItem>,
      <FormItem key="helpRemark" {...formLayout} label="帮助说明">
        {getFieldDecorator('helpRemark', {
          initialValue: formVals.helpRemark,
        })(<TextArea rows={4} placeholder="请输入" />)}
      </FormItem>,
    ];
  };

  renderAuthPage = formVals => {
    const {
      form: { getFieldDecorator },
      authList,
    } = this.props;
    const pageTree = getPages(formVals.portType);
    const formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
    let functionPages = get(formVals, 'functionPages');
    if (!functionPages) functionPages = [];
    return [
      <Row key="authsAndPage">
        <Col md={12} sm={24}>
          <FormItem key="auths" style={{ marginBottom: 0 }} {...formLayout} label="权限">
            {getFieldDecorator('auths', {
              initialValue: formVals.auths,
            })(<AuthSelect data={authList} />)}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem key="functionPages" {...formLayout} label="页面">
            {getFieldDecorator('functionPages', {
              initialValue: formVals.functionPages,
            })(
              <TreeSelect
                treeData={pageTree}
                treeCheckable
                showCheckedStrategy={SHOW_CHILD}
                treeNodeFilterProp="title"
                searchPlaceholder="请选择"
                style={{ width: '100%' }}
                onChange={this.handlePageChange}
                getPopupContainer={() => document.getElementById('updateForm')}
              />
            )}
          </FormItem>
        </Col>
      </Row>,
      <Row key="buttons">
        {getFieldDecorator('buttons', {
          initialValue: formVals.buttons,
        })(<PageTableForm />)}
      </Row>,
    ];
  };

  renderContent = (currentStep, formVals) => {
    if (currentStep === 1) {
      return this.renderAuthPage(formVals);
    }

    return this.renderBase(formVals);
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { currentStep, formVals } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="功能配置"
        maskClosable={false}
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="权限与页面" />
        </Steps>
        <div id="updateForm">{this.renderContent(currentStep, formVals)}</div>
      </Modal>
    );
  }
}

export default FunctionUpdateForm;
