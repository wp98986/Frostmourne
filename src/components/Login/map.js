import React from 'react';

import {
  BankOutlined,
  CompassOutlined,
  FullscreenOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  PhoneOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';

import styles from './index.less';

export default {
  OrgType: {
    props: {
      size: 'large',
      id: 'orgType',
      prefix: <UserOutlined className={styles.prefixIcon} />,
      placeholder: '选择企业类型',
    },
    rules: [
      {
        required: true,
        message: '请选择企业类型',
      },
    ],
  },
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      prefix: <UserOutlined className={styles.prefixIcon} />,
      placeholder: '输入您的用户名或手机号',
    },
    rules: [
      {
        required: true,
        message: '请输入用户名或手机号',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <LockOutlined className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '输入您的密码',
    },
    rules: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <MobileOutlined className={styles.prefixIcon} />,
      placeholder: '输入您的手机号码',
    },
    rules: [
      {
        required: true,
        message: '请输入您的手机号码',
      },
      {
        pattern: /^1\d{10}$/,
        message: '请输入有效的11位手机号码',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <MailOutlined className={styles.prefixIcon} />,
      placeholder: '输入手机收到的6位验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码',
      },
    ],
  },
  Org: {
    props: {
      size: 'large',
      prefix: <BankOutlined className={styles.prefixIcon} />,
      placeholder: '输入企业名称',
    },
    rules: [
      {
        required: true,
        message: '请输入企业名称',
      },
    ],
  },
  Linkman: {
    props: {
      size: 'large',
      prefix: <UserOutlined className={styles.prefixIcon} />,
      placeholder: '输入企业联系人',
    },
    rules: [
      {
        required: true,
        message: '请输入联系人',
      },
    ],
  },
  ContactNumber: {
    props: {
      size: 'large',
      prefix: <PhoneOutlined className={styles.prefixIcon} />,
      placeholder: '输入联系人手机号码',
    },
    rules: [
      {
        required: true,
        message: '请输入联系人手机号码',
      },
      {
        pattern: /^1\d{10}$/,
        message: '请输入有效的11位手机号码',
      },
    ],
  },
  Area: {
    props: {
      size: 'large',
      prefix: <FullscreenOutlined className={styles.prefixIcon} />,
      placeholder: '选择省/市/区',
    },
    rules: [
      {
        required: true,
        message: '请选择区域',
      },
    ],
  },
  Address: {
    props: {
      size: 'large',
      prefix: <CompassOutlined className={styles.prefixIcon} />,
      placeholder: '输入详细地址',
    },
    rules: [
      {
        required: true,
        message: '请输入详细地址',
      },
    ],
  },
  Realname: {
    props: {
      size: 'large',
      prefix: <IdcardOutlined className={styles.prefixIcon} />,
      placeholder: '输入真实姓名',
    },
    rules: [
      {
        required: true,
        message: '请输入真实姓名',
      },
      {
        pattern: /^[\u4e00-\u9fa5]{2,6}$/,
        message: '真实姓名只能是汉字',
      },
    ],
  },
  InviteCode: {
    props: {
      size: 'large',
      prefix: <SolutionOutlined className={styles.prefixIcon} />,
      placeholder: '输入邀请码',
    },
    rules: [
      {
        required: true,
        message: '请输入邀请码',
      },
    ],
  },
};
