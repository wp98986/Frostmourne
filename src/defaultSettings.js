let skin;
// if (process.env.APP_TYPE === 'site') {
//   skin = {
//     navTheme: 'dark',
//     primaryColor: '#FA541C',
//     linkColor: '#FA541C',
//     layout: 'sidemenu',
//     contentWidth: 'Fluid',
//     fixedHeader: false,
//     autoHideHeader: false,
//     fixSiderbar: false,
//   };
// } else
if (process.env.APP_TYPE === 'frontsite' || process.env.APP_TYPE === 'site') {
  skin = {
    primaryColor: '#cf0000',
    linkColor: '#cf0000',
    navTheme: 'dark',
    layout: 'sidemenu',
    contentWidth: 'Fluid',
    fixedHeader: true,
    autoHideHeader: false,
    fixSiderbar: false,
    collapse: true,
  };
} else if (process.env.APP_TYPE === 'designer') {
  skin = {
    primaryColor: '#216386',
    linkColor: '#216386',
    navTheme: 'dark',
    layout: 'sidemenu',
    contentWidth: 'Fluid',
    fixedHeader: true,
    autoHideHeader: false,
    fixSiderbar: false,
    collapse: true,
  };
} else {
  skin = {
    navTheme: 'dark',
    primaryColor: '#1890FF',
    layout: 'sidemenu',
    contentWidth: 'Fluid',
    fixedHeader: true,
    autoHideHeader: false,
    fixSiderbar: false,
  };
}
module.exports = skin;
