function getLabel(key) {
  const values = Object.values(this);
  const matchValue = values.find(v => v.key === key);
  if (!matchValue) {
    // 兼容历史逻辑，以前是根据枚举的名称，而不是key查找的
    const enums = this[key];
    return enums ? enums.label : undefined;
  }
  return matchValue ? matchValue.label : matchValue;
}

function getByKey(key) {
  const values = Object.values(this);
  const matchValue = values.find(v => v.key === key);
  return matchValue;
}

export default function addLabelFunc(enums) {
  const keys = Object.keys(enums);
  for (let i = keys.length - 1; i >= 0; i--) {
    const v = enums[keys[i]];
    if (!v.getLabel) {
      v.getLabel = getLabel;
      v.getByKey = getByKey;
    }
  }
}
