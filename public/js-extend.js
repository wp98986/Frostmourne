/* eslint-disable */
get = function(obj, key) {
  return key.split('.').reduce(function(o, x) {
    return typeof o == 'undefined' || o === null ? o : o[x];
  }, obj);
};

set = function(obj, arr, value) {
  var array = arr.split('.');
  var currenObject = obj;
  for (var i = 0; i < array.length; i++) {
    var fieldName = array[i];
    if (i == array.length - 1) {
      currenObject[fieldName] = value;
    } else {
      if (typeof currenObject[fieldName] === 'undefined') {
        currenObject[fieldName] = {};
      }
      currenObject = currenObject[fieldName];
    }
  }
  return currenObject;
};

dateBefore = function(date1, date2) {
  var oneDay = 24 * 60 * 60 * 1000;
  var dayDifference = (date1 - date2) / oneDay;
  dayDifference = Math.floor(dayDifference);
  return dayDifference;
};

getAppName = function() {
  var appName = get(window, 'app.name');
  return appName;
};

getUploadProps = function(fieldName, defaultValue) {
  var { getFieldProps } = this.props.form;

  var initialValue;
  if (defaultValue) {
    if (!Array.isArray(defaultValue)) {
      defaultValue = [defaultValue];
    }
    initialValue = defaultValue.map(function(value, index) {
      var imgSrc = getThumbUrl(IMGSRC + '/' + value, '135');
      return {
        uid: -index,
        status: 'done',
        url: imgSrc,
        origUrl: value,
      };
    });
  }
  return getFieldProps(fieldName, {
    initialValue,
    onChange: this.handlePhotoChange,
    valuePropName: 'fileList',
    normalize: normalizeFile,
  });
};

handlePhotoChange = function(info) {
  var fileList = info.fileList;

  // 2. 读取远程路径并显示链接
  fileList = fileList.map(function(file) {
    if (file.response) {
      // 组件会将 file.url 作为链接进行展示
      var url = file.response.data[0];
      var imgSrc = getThumbUrl(IMGSRC + '/' + url, '135');
      file.url = imgSrc;
      file.origUrl = url;
    }
    return file;
  });

  // 3. 按照服务器返回信息筛选成功上传的文件
  fileList = fileList.filter(function(file) {
    if (file.response) {
      return file.response.success;
    }
    return true;
  });
};

clone = function(obj) {
  //对象深拷贝
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  var newObj = new obj.constructor(); //保持继承链
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      //不遍历其原型链上的属性
      var val = obj[key];
      newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; // 使用arguments.callee解除与函数名的耦合
    }
  }
  return newObj;
};

//去除字符串收尾空格
stringTrim = function(str) {
  //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, '');
};

trimSpace = function(data) {
  if (!data) return;
  for (var i in data) {
    var field = data[i];
    if (field) {
      if (typeof field == 'string') {
        data[i] = stringTrim(field);
      } else if (field instanceof Array) {
        for (var j = 0; j < field.length; j++) {
          trimSpace(field[j]);
        }
      } else if (typeof field == 'object') {
        for (var m in field) {
          trimSpace(field[m]);
        }
      }
    }
  }
  return data;
};

Array.prototype.remove = function(index) {
  this.splice(index, 1);
};

Array.prototype.unique = function() {
  var result = [];
  var hash = {};
  for (var i = 0; i < this.length; i++) {
    var hashKey = JSON.stringify(this[i]);
    if (!hash[hashKey]) {
      result.push(this[i]);
      hash[hashKey] = true;
    }
  }
  return result;
};
