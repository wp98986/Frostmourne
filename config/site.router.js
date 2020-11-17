export default [
  // user
  {
    path: '/user',
    name: 'user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      { path: '/user/modpwd', name: 'modpwd', component: './User/ModPwd' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    // needAuth: true,
    routes: [
      // dashboard
      { path: '/', redirect: '/homepage' },
      // 搞事情
      {
        path: '/homepage',
        name: 'homepage',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/homepage',
            redirect: '/homepage/view',
          },
          {
            path: '/homepage/view',
            name: 'homepageview',
            component: './Site/HomePage/HomePage',
          },
        ],
      },
      {
        name: 'site',
        path: '/basic',
        routes: [
          {
            path: '/basic/org',
            name: 'org',
            component: './Site/Org/OrgInfo',
            needCtrlChidrenBtn: true,
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/basic/org',
                redirect: '/basic/org/department',
              },
              {
                path: '/basic/org/department',
                name: 'info',
                btns: [
                  { key: 'edit', label: '修改' },
                  { key: 'dealPwd', label: '交易密码' },
                ],
                component: './Site/Org/Department',
              },
              {
                path: '/basic/org/paypwd',
                name: 'pwd',
                component: './Site/Org/DealPwd',
              },
            ],
          },
          {
            path: '/basic/role',
            name: 'role',
            btns: [{ key: 'edit', label: '修改' }],
            component: './Site/Role/RoleList',
          },
          {
            path: '/basic/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            btns: [{ key: 'edit', label: '修改' }],
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/basic/settings',
                redirect: '/basic/settings/personal',
              },
              {
                path: '/basic/settings/personal',
                name: 'personal',
                component: './Account/Settings/PersonalView',
                btns: [{ key: 'sendInvite', label: '邀请' }],
              },
              {
                path: '/basic/settings/invitedorg',
                name: 'invitedorg2',
                component: './Site/Org/InvitedOrg',
                btns: [{ key: 'view', label: '查看' }],
                needAuth: true,
              },
              {
                path: '/basic/settings/security',
                component: './Account/Settings/SecurityView',
              },
            ],
          },
        ],
      },

      {
        component: '404',
        needAuth: false,
      },
    ],
  },
];
