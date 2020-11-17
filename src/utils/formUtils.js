const validatorPhone = (rule, value, callback) => {
  if (value) {
    if (value.length !== 11 && value.length !== 0) {
      callback('请输入有效的11位手机号码');
    } else if (value.length === 0) {
      callback();
    }
  }
  callback();
};

const validatorLength = (rule, value, callback) => {
  if (value) {
    if (value.length > 20 && value.length !== 0) {
      callback('最大长度不超过20');
    } else if (value.length === 0) {
      callback();
    }
  }
  callback();
};

const validatorAddress = (rule, value, callback) => {
  if (value) {
    if (value.length > 40 && value.length !== 0) {
      callback('地址长度不超过40');
    } else if (value.length === 0) {
      callback();
    }
  }
  callback();
};

const validatorRealName = (rule, value, callback) => {
  // const reg = RegExp(/^[\u4e00-\u9fa5]{2,20}$/);
  if (value) {
    // if (!reg.test(value) && value.length !== 0) {
    //   callback('姓名只能是汉字并不超过20个字符');
    // } else if (value.length === 0) {
    //   callback();
    // }
    if (value.length > 10) {
      callback('姓名不超过10个字符');
    } else {
      callback();
    }
  }
  callback();
};

const validatorIdCard = (rule, value, callback) => {
  let newValue = value;
  if (newValue === null) newValue = '';
  if (newValue.length !== 18 && newValue.length !== 0) {
    callback('请输入有效的18位二代身份证号码');
  } else if (newValue.length === 0) {
    callback();
  }
  callback();
};

const validatorUserName = (rule, value, callback) => {
  const reg = RegExp(/^(?!\d+$)[\dA-Za-z\u4e00-\u9fa5_]{3,16}$/);
  if (value) {
    if (!reg.test(value) && value.length !== 0) {
      callback('用户名必须是3-16位字母，且不能为纯数字');
    } else if (value.length === 0) {
      callback();
    }
  }
  callback();
};

const validatorContent = (rule, value, callback) => {
  if (value && value.length > 800) {
    callback('最多不超过800字');
  }
  callback();
};

const validatorRemark = (rule, value, callback) => {
  if (value && value.length > 300) {
    callback('最多不超过300字');
  }
  callback();
};

const validatorVersionCode = (rule, value, callback) => {
  const reg = RegExp(/^[0-9]*\.\d{2}\.\d{3}$/);
  if (value) {
    if (!reg.test(value) && value.length !== 0) {
      callback('版本号必须是0-9数字与.组合,例:1.01.001');
    } else if (value.length === 0) {
      callback();
    }
  }
  callback();
};

export {
  validatorPhone,
  validatorRealName,
  validatorIdCard,
  validatorUserName,
  validatorLength,
  validatorContent,
  validatorRemark,
  validatorAddress,
  validatorVersionCode,
};
