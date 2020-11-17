import { parse } from 'url';
import multiparty from 'multiparty';
import _ from 'lodash/array';

export function parseUpdateParam(req, cb) {
  const form = new multiparty.Form();
  form.parse(req, (err, fields) => {
    const { updateParam: up } = fields;
    cb(JSON.parse(up[0]));
  });
}

export function baseRemove(dataSource) {
  return function realRemove(req, res) {
    parseUpdateParam(req, ({ id }) => {
      const removed = _.remove(dataSource, data => data.id === id);
      res.json({
        errorMessage: '',
        readTime: new Date(),
        data: {
          code: '2003',
          message: '成功',
          messageCode: 'SUCCESS',
          updateNumber: removed.length,
        },
        success: true,
      });
    });
  };
}

export function baseFind(originDataSource) {
  return function realQuery(req, res, originUrl) {
    let url = originUrl;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
    }

    const params = parse(url, true).query;
    const queryParam = JSON.parse(params.queryParam);
    const { id } = queryParam;
    let dataSource = originDataSource;
    let data;
    dataSource = dataSource.filter(x => x.id === parseInt(id, 10));
    if (dataSource.length > 0) data = dataSource[0];
    return res.json({
      errorMessage: '',
      readTime: new Date(),
      success: true,
      data,
    });
  };
}

export function baseQuery(originDataSource, customerFilter, paged = true) {
  return function realQuery(req, res, originUrl) {
    let url = originUrl;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
    }

    const params = parse(url, true).query;
    const queryParam = JSON.parse(params.queryParam);

    let dataSource = originDataSource;
    if (typeof customerFilter === 'function') {
      dataSource = dataSource.filter(data => customerFilter(queryParam, data));
    }

    if (paged) {
      const totalCount = dataSource.length;
      const { page = 1, pageSize = 10 } = queryParam;
      dataSource = dataSource.slice((page - 1) * pageSize, page * pageSize);
      return res.json({
        errorMessage: '',
        readTime: new Date(),
        success: true,
        data: {
          modelList: dataSource,
          totalCount,
        },
      });
    }

    return res.json({
      errorMessage: '',
      readTime: new Date(),
      success: true,
      data: dataSource,
    });
  };
}

export function baseUpdate(originDataSource) {
  return function realUpdate(req, res) {
    parseUpdateParam(req, updateParam => {
      const { id } = updateParam;
      const target = originDataSource.find(d => d.id === id);
      Object.assign(target, updateParam);
      res.json({
        errorMessage: '',
        readTime: new Date(),
        data: {
          code: '2003',
          message: '成功',
          messageCode: 'SUCCESS',
          updateNumber: 1,
        },
        success: true,
      });
    });
  };
}

export function baseAdd(originDataSource, convertParamToModel) {
  return function realAdd(req, res) {
    parseUpdateParam(req, updateParam => {
      originDataSource.push(convertParamToModel(updateParam));
      res.json({
        errorMessage: '',
        readTime: new Date(),
        data: {
          code: '2003',
          message: '成功',
          messageCode: 'SUCCESS',
          updateNumber: 1,
        },
        success: true,
      });
    });
  };
}
