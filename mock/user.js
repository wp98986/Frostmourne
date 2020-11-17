// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'POST /site/login': {
    data: { code: '203', message: '成功', messageCode: 'SUCCESS' },
    success: true,
    errorMessage: '',
    readTime: '2018-12-25T07:09:04.544+0000',
  },
  'POST /boss/login': {
    data: { code: '203', message: '成功', messageCode: 'SUCCESS' },
    success: true,
    errorMessage: '',
    readTime: '2018-12-25T07:09:04.544+0000',
  },
  'GET /site/staff/currentinfo': {
    data: {
      userName: '苏乞儿',
      realName: '苏志力',
      idCard: '440681199412130328',
      user: {
        avatar:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
        headImg:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
        userName: '苏乞儿',
      },
      headImg:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '优工优服忠实粉丝',
      title: '店长',
      group: '顺德大自然大良分店',
      area: ['广东', '佛山', '顺德区'],
      address: '顺德区明日广场1305',
      mobile: '18578303396',
      sex: 'male',
    },
  },
  'GET /boss/staff/currentinfo': {
    data: {
      userName: '苏乞儿',
      realName: '苏志力',
      idCard: '440681199412130328',
      user: {
        avatar:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
        headImg:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
        userName: '苏乞儿',
      },
      headImg:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '优工优服忠实粉丝',
      title: '店长',
      group: '顺德大自然大良分店',
      area: ['广东', '佛山', '顺德区'],
      address: '顺德区明日广场1305',
      mobile: '18578303396',
      sex: 'male',
    },
  },
  'GET /business/staff/currentinfo': {
    data: {
      userName: '苏乞儿',
      realName: '苏志力',
      idCard: '440681199412130328',
      user: {
        avatar:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
        headImg:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
        userName: '苏乞儿',
      },
      headImg:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542272840700&di=3e36893aaf511209df6f23373233ca64&imgtype=0&src=http%3A%2F%2Fwww.jituwang.com%2Fuploads%2Fallimg%2F150922%2F258230-150922221K447.jpg',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '优工优服忠实粉丝',
      title: '店长',
      group: '顺德大自然大良分店',
      area: ['广东', '佛山', '顺德区'],
      address: '顺德区明日广场1305',
      mobile: '18578303396',
      sex: 'male',
    },
  },
  'GET /site/staff/changelist': [],
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    // temp mock
    res.send({
      status: 'ok',
      type,
      currentAuthority: 'admin',
    });
    if (password === 'ant.design' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === 'ant.design' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
