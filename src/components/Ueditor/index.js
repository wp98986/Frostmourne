import React, { PureComponent } from 'react';
import { Input } from 'antd';
import E from 'wangeditor';

const { TextArea } = Input;

class Ueditor extends PureComponent {
  constructor(props) {
    super(props);
    const value = props.value || '';
    this.state = {
      editorHtml: value,
      showCode: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  getValue() {
    return this.editor.txt.html();
  }

  setValue(html) {
    this.editor.txt.html(html);
    this.setState({
      editorHtml: html,
    });
  }

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  showCode = () => {
    const { showCode } = this.state;
    this.setState({ showCode: !showCode });
  };

  init() {
    const elem = this.editorElem;
    const editor = new E(elem);
    this.editor = editor;
    const { value } = this.props;

    editor.customConfig.onchange = html => {
      this.setState({
        editorHtml: html,
      });
      this.triggerChange(html);
    };
    let appType = APP_TYPE;
    if (appType === 'frontsite') appType = 'site';
    editor.customConfig.uploadImgServer = `/${appType}/uploadImgs`;
    editor.customConfig.uploadFileName = 'file';
    editor.customConfig.uploadImgTimeout = 60000;
    editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result) => {
        const url = result.data;
        for (let i = 0; i < url.length; i++) {
          const element = url[i];
          insertImg(element);
        }
      },
    };

    editor.customConfig.zIndex = 99;
    editor.create();
    editor.txt.html(value);
  }

  render() {
    const { editorHtml, showCode } = this.state;
    const { type } = this.props;
    return (
      <div>
        <div
          ref={editorElem => {
            this.editorElem = editorElem;
          }}
          style={{ textAlign: 'left' }}
        />
        {type !== 'simple' ? (
          <div>
            <div>插入html代码</div>
            <TextArea
              rows={8}
              value={editorHtml}
              onChange={e => {
                const newHtml = e.target.value;
                this.setState({
                  editorHtml: newHtml,
                });
              }}
              onBlur={e => {
                const newHtml = e.target.value;
                this.triggerChange(newHtml);
                this.editor.txt.html(newHtml);
              }}
            />
          </div>
        ) : (
          <div>
            <a onClick={this.showCode} style={{ float: 'right' }}>
              {showCode ? '关闭源码' : '查看源码'}
            </a>
            {showCode ? (
              <TextArea
                rows={8}
                value={editorHtml}
                onChange={e => {
                  const newHtml = e.target.value;
                  this.setState({
                    editorHtml: newHtml,
                  });
                }}
                onBlur={e => {
                  const newHtml = e.target.value;
                  this.triggerChange(newHtml);
                  this.editor.txt.html(newHtml);
                }}
              />
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default Ueditor;
