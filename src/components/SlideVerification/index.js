import React, { Component } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import styles from './index.less';
import jigsaw from './jigsaw';

@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/verificateStr'],
}))
class SlideVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
    // setTimeout(() => {
    //   jigsaw.init({
    //     el: document.getElementById('slideVerification'),
    //     width: document.getElementById('slideVerification').clientWidth,
    //     onSuccess: () => {
    //       if (typeof successHandler === 'function') {
    //         successHandler(this.str);
    //       }
    //     },
    //   });
    // }, 300);
  }

  reset = () => {
    const { successHandler } = this.props;
    $('#slideVerification').remove();
    setTimeout(() => {
      $('#slideWrap').append("<div id='slideVerification' className={styles.slideVerification} />");
    }, 50);
    setTimeout(() => {
      jigsaw.init({
        el: document.getElementById('slideVerification'),
        width: document.getElementById('slideVerification').clientWidth,
        onSuccess: () => {
          if (typeof successHandler === 'function') {
            successHandler(this.str);
          }
        },
      });
    }, 100);
  };

  fetchStr = () => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: 'user/verificateStr',
      payload: {},
      callback: data => {
        that.str = data;
      },
    });
  };

  render() {
    return (
      <div id="slideWrap">
        <div id="slideVerification" className={styles.slideVerification} />
      </div>
    );
  }
}

export default SlideVerification;
