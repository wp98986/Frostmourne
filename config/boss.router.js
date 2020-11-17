export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    name: 'user',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      { path: '/user/modpwd', name: 'modpwd', component: './User/ModPwd' },
      { path: '/user/register-result', name: 'modpwd', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/homepage' },
      {
        path: '/homepage',     
        name: 'homepage',
        component: './Boss/HomePage/HomePage',
      },
      {
        name: 'site',     
        path: '/basic',
        routes: [
          {
            path: '/basic/org',
            name: 'org',
            component: './Site/Org/OrgInfo',
            hideChildrenInMenu: true,
            platFlag: true,          
            routes: [
              {
                path: '/basic/org',
                redirect: '/basic/org/department',
              },
              {
                path: '/basic/org/department',
                name: 'info',
                component: './Site/Org/Department',
                btns: [{ key: 'edit', label: '修改' }],
              },
              {
                path: '/basic/org/invitedorg',
                name: 'invitedorg',
                component: './Site/Org/InvitedOrg',
                btns: [{ key: 'view', label: '查看' }],
              },
            ],
          },
          {
            path: '/basic/role',
            name: 'role',           
            component: './Site/Role/RoleList',
            btns: [{ key: 'edit', label: '修改' }],
          },
          {
            path: '/basic/settings',
            name: 'settings',
            component: './Account/Settings/Info',        
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
                btns: [{ key: 'edit', label: '修改' }],
              },
              {
                path: '/basic/settings/invitedorg',
                component: './Site/Org/InvitedOrg',
                btns: [{ key: 'view', label: '查看' }],
              },
              {
                path: '/basic/settings/security',
                component: './Account/Settings/SecurityView',
                btns: [{ key: 'edit', label: '修改' }],
              },
            ],
          },
        ],
      },
      {
        name: 'boss',      
        path: '/setting',
        routes: [
          {
            path: '/setting/function',
            name: 'function',     
            btns: [{ key: 'edit', label: '修改' }],
            component: './Boss/Function/FunctionList',
          },
          {
            path: '/setting/app',
            name: 'app',
            btns: [{ key: 'edit', label: '修改' }],
            hideChildrenInMenu: true,
            
            routes: [
              {
                path: '/setting/app',
                redirect: '/setting/app/list',
              },
              {
                path: '/setting/app/list',
                name: 'list',
                btns: [{ key: 'edit', label: '修改' }],
                component: './Boss/App/AppList',
              },
              {
                path: '/setting/app/edit/:id',
                component: './Boss/App/AppEdit',
                btns: [{ key: 'edit', label: '修改' }],
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/setting/app/edit/:id',
                    redirect: '/setting/app/edit/basic/:id',
                  },
                  {
                    path: '/setting/app/edit/basic/:id',
                    name: 'edit',
                    component: './Boss/App/AppEditBasic',
                  },
                  {
                    path: '/setting/app/edit/advanced/:id',
                    name: 'advanced',
                    component: './Boss/App/AppEditAdvanced',
                  },
                ],
              },
              {
                path: '/setting/app/add',
                component: './Boss/App/AppEdit',
                btns: [{ key: 'edit', label: '修改' }],
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/setting/app/add',
                    redirect: '/setting/app/add/basic',
                  },
                  {
                    path: '/setting/app/add/basic',
                    name: 'edit',
                    component: './Boss/App/AppEditBasic',
                  },
                  {
                    path: '/setting/app/add/advanced',
                    name: 'advanced',
                    component: './Boss/App/AppEditAdvanced',
                  },
                ],
              },
              {
                path: '/setting/app/view/:id',
                name: 'view',
                component: './Boss/App/AppView',
              },
            ],
          },
          {
            path: '/setting/role',
            name: 'role',
            hideChildrenInMenu: true,
          
            routes: [
              {
                path: '/setting/role',
                redirect: '/setting/role/list',
              },
              {
                path: '/setting/role/list',
                name: 'list',
                component: './Boss/Role/RoleList',
                btns: [{ key: 'edit', label: '修改' }],
              },
              {
                path: '/setting/role/edit/:id',
                component: './Boss/Role/RoleEdit',
                btns: [{ key: 'edit', label: '修改' }],
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/setting/role/edit/:id',
                    redirect: '/setting/role/edit/basic/:id',
                  },
                  {
                    path: '/setting/role/edit/basic/:id',
                    name: 'edit',
                    component: './Boss/Role/RoleEditBasic',
                  },
                  {
                    path: '/setting/role/edit/advanced/:id',
                    name: 'advanced',
                    component: './Boss/Role/RoleEditAdvanced',
                  },
                ],
              },
              {
                path: '/setting/role/add',
                component: './Boss/Role/RoleEdit',
                hideChildrenInMenu: true,
                btns: [{ key: 'edit', label: '修改' }],
                routes: [
                  {
                    path: '/setting/role/add',
                    redirect: '/setting/role/add/basic',
                  },
                  {
                    path: '/setting/role/add/basic',
                    name: 'edit',
                    component: './Boss/Role/RoleEditBasic',
                  },
                  {
                    path: '/setting/role/add/advanced',
                    name: 'advanced',
                    component: './Boss/Role/RoleEditAdvanced',
                  },
                ],
              },
              {
                path: '/setting/role/view/:id',
                name: 'view',
                btns: [
                  { key: 'view', label: '查看' },
                  { key: 'edit', label: '修改' },
                ],
                component: './Boss/Role/RoleView',
              },
            ],
          },

          // 属性包
          // {
          //   path: '/setting/propertybag',
          //   name: 'propertybag',
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: '/setting/propertybag',
          //       redirect: '/setting/propertybag/list',
          //     },
          //     {
          //       path: '/setting/propertybag/list',
          //       name: 'list',
          //       component: './Boss/PropertyBag/PropertyBagList',
          //       btns: [{ key: 'edit', label: '修改' }],
          //     },
          //     {
          //       path: '/setting/propertybag/add',
          //       name: 'add',
          //       component: './Boss/PropertyBag/PropertyBagEdit',
          //       btns: [{ key: 'edit', label: '修改' }],
          //     },
          //     {
          //       path: '/setting/propertybag/edit/:id',
          //       name: 'edit',
          //       component: './Boss/PropertyBag/PropertyBagEdit',
          //       btns: [{ key: 'edit', label: '修改' }],
          //     },
          //     {
          //       path: '/setting/propertybag/view/:id',
          //       name: 'view',
          //       component: './Boss/PropertyBag/PropertyBagView',
          //       btns: [{ key: 'edit', label: '修改' }],
          //     },
          //   ],
          // },
        ],
      },

      {
        component: '404',
      },
    ],
  },
];
