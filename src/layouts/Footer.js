import React, { Fragment } from 'react';
import { CopyrightOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={
        [
          // {
          //   key: '首页',
          //   title: '首页',
          //   href: 'https://pro.ant.design',
          //   blankTarget: true,
          // },
          // {
          //   key: 'github',
          //   title: <Icon type="github" />,
          //   href: 'https://github.com/ant-design/ant-design-pro',
          //   blankTarget: true,
          // },
          // {
          //   key: '前往优工优服官网',
          //   title: (
          //     <span>
          //       <Icon type="link" />
          //       &nbsp;优工优服
          //     </span>
          //   ),
          //   href: 'https://www.ufu100.com',
          //   blankTarget: true,
          // },
        ]
      }
      copyright={
        <Fragment>
          Copyright <CopyrightOutlined /> 2020 德尔集团有限公司信息中心支持
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
