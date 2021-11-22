# XFYun NLS

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![action][ci-image]][ci-url]
[![license][license-image]][repository-url]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[ci-image]: https://img.shields.io/github/workflow/status/funnyzak/xfyun-nls/Node.js%20CI
[ci-url]: https://github.com/funnyzak/xfyun-nls/actions
[license-image]: https://img.shields.io/github/license/funnyzak/xfyun-nls.svg?style=flat-square
[repository-url]: https://github.com/funnyzak/xfyun-nls
[npm-image]: https://img.shields.io/npm/v/xfyun-nls.svg?style=flat-square
[npm-url]: https://npmjs.org/package/xfyun-nls
[download-image]: https://img.shields.io/npm/dm/xfyun-nls.svg?style=flat-square
[download-url]: https://npmjs.org/package/xfyun-nls

讯飞云自然语言处理 Node 模块。

## 开始

from [npm](https://github.com/npm/npm)

    $ npm install xfyun-nls

## 模块

### 在线语音合成

#### 用例

```js
const { XFYunTTS } = require('xfyun-nls');
const path = require('path');

!(async () => {
  const _xfyTTS = new XFYunTTS(
    {
      // XFYunTTS.Config
      appId: 'appid',
      apiSecret: 'apisecret',
      apiKey: 'apikey',
      host: 'tts-api.xfyun.cn',
      uri: '/v2/tts',
      hostUrl: 'wss://tts-api.xfyun.cn/v2/tts'
    },
    path.join(
      process.cwd(),
      new Date().getTime().toString()
    ) /** catchPath (optional) **/
  );

  // send
  console.log((await _xfyTTS.send('你好')).filePath);

  // more ...
})();
```

了解更多 [TTS Define](https://github.com/funnyzak/xfyun-nls/blob/master/lib/tts.d.ts).

#### 函数

`XFYunTTS` 有如下方法:

##### `checkConfig(): Promise<boolean>`

返回值 `Promise<boolean>` - 返回讯飞云语音配置密钥是否有效。

```js
const checkRlt = await _XFYunTTS.checkConfig();
console.log(checkRlt ? 'the config is passed' : 'error config');
```

##### `send(text: string, options?: XFYunTTS.BusinessOption): Promise<XFYunTTS.TTSComplete>`

- `text` string - 要转换的文本。
- `options` XFYunTTS.BusinessOption (optional) - 合成设置。

返回值 `Promise<XFYunTTS.TTSComplete>` - 转换完成对象。

#### 定义

##### BusinessOption

请看定义 [BusinessOption](https://github.com/funnyzak/xfyun-nls/blob/master/lib/tts.d.ts)。

##### TTSComplete

请看定义 [TTSComplete](https://github.com/funnyzak/xfyun-nls/blob/master/lib/tts.d.ts)。

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [funnyzak](https://yycc.me/)                                                                                                                           |

## 参考

- [文本语音合成文档](https://www.xfyun.cn/doc/tts/online_tts/API.html)
- [错误慢参考解决](https://www.xfyun.cn/document/error-code)

## License

Apache-2.0 License © 2021 [funnyzak](https://github.com/funnyzak)
