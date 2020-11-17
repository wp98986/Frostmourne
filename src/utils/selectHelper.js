import React from 'react';

export function pinyinFilterOption(val, option) {
  let match = false;
  const inputValue = val.toUpperCase();
  const { children } = option.props;
  React.Children.map(children, cd => {
    const child = cd.toUpperCase();
    const childPinyinCamel = pinyin.getCamelChars(child).toUpperCase();
    const childPinyin = pinyin.getFullChars(child).toUpperCase();
    match =
      match ||
      child.includes(inputValue) ||
      childPinyin.includes(inputValue) ||
      childPinyinCamel.includes(inputValue);
  });
  return match;
}

export function todo() {
  // 未來扩展用，躲避eslint检查
}
