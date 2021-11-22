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

## 目录

- [XFYun NLS](#xfyun-nls)
  - [目录](#目录)
  - [开始](#开始)
  - [模块](#模块)
    - [在线语音合成](#在线语音合成)
      - [用例](#用例)
      - [函数](#函数)
        - [`checkConfig(): Promise<boolean>`](#checkconfig-promiseboolean)
        - [`send(text: string, options?: XFYunTTS.BusinessOption): Promise<XFYunTTS.TTSComplete>`](#sendtext-string-options-xfyunttsbusinessoption-promisexfyunttsttscomplete)
      - [定义](#定义)
        - [XFYunTTS.BusinessOption](#xfyunttsbusinessoption)
        - [XFYunTTS.TTSComplete](#xfyunttsttscomplete)
  - [Author](#author)
  - [参考](#参考)
  - [License](#license)

## 开始

from [npm](https://github.com/npm/npm)

    $ npm install xfyun-nls

## 模块

### 在线语音合成

#### 用例

```js
const { XFYunTTS } = require('xfyun-nls');
const path = require('path');
const fs = require('fs');

!(async () => {
  const cachePath = path.join(process.cwd(), new Date().getTime().toString());
  fs.mkdirSync(cachePath);

  const _xfyTTS = new XFYunTTS(
    {
      appId: '5e3b7ffe',
      apiSecret: '8440c6f3dc6e3b864a043dbb6c37afd0',
      apiKey: '1394021f9ef53a9a9400b4d8a5f4652a',
      host: 'tts-api.xfyun.cn',
      uri: '/v2/tts',
      hostUrl: 'wss://tts-api.xfyun.cn/v2/tts'
    } /** XFYunTTS.Config **/,
    cachePath /** catchPath (optional) **/
  );

  // send
  console.log('TTS COMPLETE:', JSON.stringify(await _xfyTTS.send('你好')));
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

##### XFYunTTS.BusinessOption

合成语言的业务参数，有如下参数：

- `tte` string - 文本编码格式。
- `aux` string - 音频编码。
- `vcn` string - 发音人。

更多请看定义 [BusinessOption](https://github.com/funnyzak/xfyun-nls/blob/master/lib/tts.d.ts)。

[官方文档参考](https://www.xfyun.cn/doc/tts/online_tts/API.html#%E6%8E%A5%E5%8F%A3%E8%A6%81%E6%B1%820)。

##### XFYunTTS.TTSComplete

合成结果对象，有如下属性：

- `filePath` string - 音频文件最终保存路径。
- `suffix` string - 文件后缀。
- `rootPath` string - 所在父文件夹路径。
- `text` string - 合成的原文本。
- `options` XFYunTTS.BusinessOption - 合成的高级选项。
- `startTime` number - 合成任务开始的时间戳（毫秒）。
- `elapsed` number - 合成所耗费的时间（毫秒）。

更多请看定义 [TTSComplete](https://github.com/funnyzak/xfyun-nls/blob/master/lib/tts.d.ts)。

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [funnyzak](https://yycc.me/)                                                                                                                           |

## 参考

- [文本语音合成文档](https://www.xfyun.cn/doc/tts/online_tts/API.html)
- [错误慢参考解决](https://www.xfyun.cn/document/error-code)

## License

Apache-2.0 License © 2021 [funnyzak](https://github.com/funnyzak)
