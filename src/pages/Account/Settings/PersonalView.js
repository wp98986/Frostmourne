import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { ClusterOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Radio, message } from 'antd';
import { connect } from 'dva';
import AvatarView from '@/components/AvatarView';
import AreaSelect from '@/components/AreaSelect';
import router from 'umi/router';
import styles from './BaseView.less';
import { getPage } from '@/utils/authority';
import {
  validatorPhone,
  // validatorRealName,
  // validatorIdCard,
  validatorUserName,
} from '@/utils/formUtils';

// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const validatorGeographic = (rule, value, callback) => {
  if (!value) {
    callback('请选择省市区');
  }
  callback();
};

@connect(({ user, loading }) => ({
  user,
  currentUser: user.currentUser,
  submitting: loading.effects['user/savePersonalInfo'],
}))
@Form.create()
class PersonalView extends Component {
  state = {
    // visible: false,
    // inviteMobile: '',
    // invitePeople: '',
    // inviteMobileNotice: '',
    // invitePeopleNotice: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      callback: result => {
        if (result.data) {
          this.setBaseInfo();
        }
      },
    });
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    const user = get(currentUser, 'data.user');
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = user[key] || null;
      const area = [];
      if (key === 'area') {
        area.push(user.province);
        area.push(user.city);
        area.push(user.district);
        obj.area = area;
      }
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    const avatar = get(currentUser, 'data.user.headImg');
    if (avatar) {
      return avatar;
    }
    return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

    // const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    // return url;
  }

  // showModal = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // };

  // invitePeopleChange = e => {
  //   const value = e.target.value;
  //   let invitePeopleNotice = '';
  //   if (value.length === '' || !value) {
  //     invitePeopleNotice = '姓名不能为空';
  //   }
  //   if (value) {
  //     this.setState({
  //       invitePeople: value,
  //     });
  //   } else {
  //     this.setState({
  //       invitePeople: '',
  //     });
  //   }
  // this.setState({
  //   invitePeopleNotice,
  // });
  // };

  // inviteMobileChange = e => {
  //   const value = e.target.value;
  //   let inviteMobileNotice = '';
  //   if (value.length !== 11 && value.length !== 0) {
  //     inviteMobileNotice = '请输入有效的11位手机号码';
  //   }
  //   if (value) {
  //     this.setState({
  //       inviteMobile: value,
  //       // inviteMobileNotice,
  //     });
  //   } else {
  //     this.setState({
  //       inviteMobile: '',
  //       // inviteMobileNotice: '',
  //     });
  //   }
  // };

  // handleOk = () => {
  //   const { dispatch, currentUser } = this.props;
  //   const { inviteMobile, invitePeople } = this.state;
  //   if (inviteMobile.length !== 11 || inviteMobile.length === 0 || invitePeople.length === 0) {
  //     message.error('请填写完整信息');
  //     return;
  //   }
  //   const inviteCode = get(currentUser, 'data.inviteCode');
  //   const userId = get(currentUser, 'data.user.id');
  //   dispatch({
  //     type: 'user/invitePerson',
  //     payload: { invitePeople, inviteMobile, inviteCode, userId },
  //     callback: result => {
  //       const { data } = result;
  //       if (data.code === '203') {
  //         message.success('发送成功');
  //         dispatch({
  //           type: 'user/fetchCurrent',
  //           callback: () => {},
  //         });
  //       } else {
  //         message.error(`发送失败，${data.message}`);
  //       }
  //     },
  //   });
  //   this.setState({
  //     visible: false,
  //   });
  // };

  // handleCancel = () => {
  //   this.setState({
  //     visible: false,
  //   });
  // };

  getViewDom = ref => {
    this.view = ref;
  };

  handleSubmit = e => {
    const { dispatch, form, currentUser } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const newValues = values;
        newValues.headImg = this.avatar.getData();
        newValues.userId = get(currentUser, 'data.user.id');
        newValues.id = get(currentUser, 'data.id');
        const area = get(newValues, 'area') ? get(newValues, 'area') : [];
        newValues.province = area[0];
        newValues.city = area[1];
        newValues.district = area[2];
        dispatch({
          type: 'user/savePersonalInfo',
          payload: newValues,
          callback: result => {
            const { data } = result;
            if (data.code === '203') {
              message.success('保存成功');
              dispatch({
                type: 'user/fetchCurrent',
                callback: res => {
                  if (res.data) {
                    this.setBaseInfo();
                  }
                },
              });
            } else {
              message.error(`保存失败，${data.message}`);
            }
          },
        });
      }
    });
  };

  changeHeadImg = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/updatePart',
      payload: { headImg: value },
      callback: result => {
        const { data } = result;
        if (data.code === '203') {
          message.success('更换成功');
          dispatch({
            type: 'user/fetchCurrent',
          });
        } else {
          let msg = '';
          if (data.message) msg = `，${data.message}`;
          message.error(`更换失败${msg}`);
        }
      },
    });
  };

  goInvite = () => {
    router.push('/basic/settings/invitedorg');
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      currentUser,
      user: { currentUser: { data: userdata = {} } = {} } = {},
    } = this.props;
    const { pages = [] } = userdata;
    // const buttons = getBtns(pages, route);
    const pagesArr = getPage(pages, { path: '/basic/settings/invitedorg' });
    // const sendInviteButton = buttons.filter(b => b === 'sendInvite').length > 0;
    // const {
    //   visible,
    //   inviteMobile,
    //   inviteMobileNotice,
    //   invitePeople,
    //   invitePeopleNotice,
    // } = this.state;
    let roles = get(currentUser, 'data.roles');
    if (!roles) roles = [];
    let rolesText = '';
    roles.map((item, index) => {
      if (index === roles.length - 1) {
        rolesText += item.name;
      } else {
        rolesText += `${item.name}，`;
      }
      return item;
    });
    let depts = get(currentUser, 'data.depts');
    if (!depts) depts = [];
    let deptsText = '';
    depts.map((item, index) => {
      if (index === depts.length - 1) {
        deptsText += item.name;
      } else {
        deptsText += `${item.name}，`;
      }
      return item;
    });
    let deptText = get(currentUser, 'data.dept.name');
    if (!deptText) deptText = '暂无';
    // const inviteCode = get(currentUser, 'data.inviteCode');
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.name' })}>
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.name-message' }, {}),
                  },
                  {
                    validator: validatorUserName,
                  },
                ],
              })(<Input disabled placeholder="请填写您的用户名" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.realName' })}>
              {getFieldDecorator('realName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.realName-message' }, {}),
                  },
                ],
              })(<Input placeholder="请填写您的真实姓名" />)}
            </FormItem>
            {
              //   <FormItem label={formatMessage({ id: 'app.settings.basic.idCard' })}>
              //   {getFieldDecorator('idCard', {
              //     rules: [
              //       {
              //         // required: true,
              //         message: formatMessage({ id: 'app.settings.basic.idCard-message' }, {}),
              //       },
              //       { validator: validatorIdCard },
              //     ],
              //   })(<Input placeholder="请填写您的身份证号码" />)}
              // </FormItem>
            }
            <FormItem label={formatMessage({ id: 'app.settings.basic.sex' })}>
              {getFieldDecorator('sex', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.sex-message' }, {}),
                  },
                ],
              })(
                <RadioGroup>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<Input disabled placeholder="请填写您的手机号码" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.geographic' })}>
              {getFieldDecorator('area', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<AreaSelect />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {})(<Input />)}
            </FormItem>
            <Button type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage id="form.save" />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <Fragment>
            <AvatarView
              onChange={this.changeHeadImg}
              ref={c => {
                this.avatar = c;
              }}
              src={this.getAvatarURL()}
              title={<FormattedMessage id="app.settings.basic.avatar" />}
            />
            <div className={styles.orginfo}>
              <div>
                <UserOutlined />
                角色：{rolesText.length > 0 ? rolesText : '暂无'}
              </div>
              <div>
                <HomeOutlined />
                部门：{deptText}
              </div>
              <div>
                <ClusterOutlined />
                管理部门：{deptsText.length > 0 ? deptsText : '暂无'}
              </div>
              {pagesArr.length > 0 ? (
                <Button type="primary" onClick={this.goInvite} style={{ marginLeft: '10px' }}>
                  去邀请
                </Button>
              ) : null}

              {/* {orgType === 'xshCurator' || !srcInviteCode ? (
                <div>
                  <Icon type="solution" />
                  邀请码（长期有效，适用于物料上）：{inviteCode}
                </div>
              ) : null} */}
              {/* <div>
                <Icon type="solution" />
                临时邀请码（只能使用一次）：
                {sendInviteButton ? (
                  <Button type="primary" onClick={this.showModal} style={{ marginLeft: '10px' }}>
                    邀请
                  </Button>
                ) : null}
                <Modal
                  title="发送邀请"
                  visible={visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  className={styles.inviteModal}
                >
                  <div className={styles.inviteMobileDiv}>
                    <span>受邀人姓名:</span>
                    <Input
                      placeholder="请填写受邀人姓名"
                      value={invitePeople}
                      onChange={this.invitePeopleChange}
                    />
                    <p className={styles.error}>{invitePeopleNotice}</p>
                  </div>
                  <div className={styles.inviteMobileDiv}>
                    <span>受邀人号码:</span>
                    <Input
                      placeholder="请填写受邀人手机号码"
                      value={inviteMobile}
                      onChange={this.inviteMobileChange}
                    />
                    <p className={styles.error}>{inviteMobileNotice}</p>
                  </div>
                </Modal>
              </div> */}
              {
                //   <div>
                //     <Icon type="smile" />
                //     邀请我的人：周铁柱
                //   </div>
              }
            </div>
          </Fragment>
        </div>
      </div>
    );
  }
}

export default PersonalView;
