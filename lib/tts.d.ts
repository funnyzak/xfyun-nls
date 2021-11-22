import WebSocket from 'ws';
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the module template file for class modules.
 *~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ Note that ES6 modules cannot directly export class objects.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('someLibrary');
 *~
 *~ Refer to the documentation to understand common
 *~ workarounds for this limitation of ES6 modules.
 */

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */

declare class XFYunTTS {
  /**
   * 讯飞端配置
   *
   * @type {XFYunTTS.Config}
   * @memberof XFYunTTS
   */
  config: XFYunTTS.Config;

  /**
   * 合成语音缓存路径
   * @type {string}
   * @memberof XFYunTTS
   */
  cachePath: string;

  /**
   * 默认转换配置
   *
   * @type {XFYunTTS.BusinessOption}
   * @memberof XFYunTTS
   */
  defaultBusinessOption: XFYunTTS.BusinessOption;

  /**
   * 当前正在处理的转换配置
   *
   * @type {XFYunTTS.BusinessOption}
   * @memberof XFYunTTS
   */
  businessOption: XFYunTTS.BusinessOption;

  /**
   *长链接WS对象
   *
   * @type {WebSocket}
   * @memberof XFYunTTS
   */
  ws: WebSocket;

  /**
   * 构造函数
   * @param config 配置
   * @param cachePath 缓存路径
   */
  constructor(config: XFYunTTS.Config, cachePath?: string);

  /**
   * 打印
   * @param message
   * @param level info/warn/error
   */
  log(message: Object, level: string): void;

  /**
   * 获取当前WSS URL
   * @returns
   */
  getWssUrl(): string;

  /**
   * 合成结果
   * @param text 转换文本
   * @param options 合成选项
   */
  send(text, options: XFYunTTS.BusinessOption): Promise<XFYunTTS.TTSComplete>;

  /**
   *检查配置
   * @returns
   */
  checkConfig(): Promise<boolean>;

  /**
   * 鉴权签名
   * @param date RTC时间
   */
  signature(date: string): string;
}

declare namespace XFYunTTS {
  export interface Config {
    appId: string;
    apiSecret: string;
    apiKey: string;
    host: string;
    uri: string;
    hostUrl?: string;
  }

  /**
   * 转换结果
   */
  export interface TTSComplete {
    /**
     * 音频文件最终保存路径
     */
    filePath: string;

    /**
     * 文件后缀
     */
    suffix: string;

    /**
     * 所在父文件夹
     */
    rootPath: string;

    /**
     * 文本
     */
    text: string;

    /**
     * 转换选项
     */
    options: BusinessOption;

    /**
     * 开始时间（毫秒时间戳）
     */
    startTime: number;

    /**
     * 耗时（毫秒）
     */
    elapsed: number;
  }

  /**
   * 合成设置
   * https://www.xfyun.cn/doc/tts/online_tts/API.html#%E6%8E%A5%E5%8F%A3%E8%A6%81%E6%B1%82
   */
  export interface BusinessOption {
    /**
     * 文本编码格式
     * GB2312
     * GBK
     * BIG5
     * UNICODE(小语种必须使用UNICODE编码，合成的文本需使用utf16小端的编码方式，详见java示例demo)
     * GB18030
     * UTF8（小语种）
     */
    tte: 'UTF8' | 'GB2312' | 'GBK' | 'BIG5' | 'UNICODE' | 'GB18030';
    /**
     * 音频编码，可选值：
     * raw：未压缩的pcm
     * lame：mp3 (当aue=lame时需传参sfl=1)
     * speex-org-wb;7： 标准开源speex（for speex_wideband，即16k）数字代表指定压缩等级（默认等级为8）
     * speex-org-nb;7： 标准开源speex（for speex_narrowband，即8k）数字代表指定压缩等级（默认等级为8）
     * speex;7：压缩格式，压缩等级1~10，默认为7（8k讯飞定制speex）
     * speex-wb;7：压缩格式，压缩等级1~10，默认为7（16k讯飞定制speex）
     */
    aue: string;
    /**
     * 需要配合aue=lame使用，开启流式返回
     * mp3格式音频
     * 取值：1 开启
     */
    sfl?: number;
    /**
     * 音频采样率，可选值：
     * audio/L16;rate=8000：合成8K 的音频
     * audio/L16;rate=16000：合成16K 的音频
     * auf不传值：合成16K 的音频
     */
    auf?: string;
    /**
     *发音人，可选值：请到控制台添加试用或购买发音人，添加后即显示发音人参数值
     */
    vcn: string;
    /**
     * 语速，可选值：[0-100]，默认为50
     */
    speed?: number;
    /**
     * 音量，可选值：[0-100]，默认为50
     */
    volume?: number;
    /**
     * 音高，可选值：[0-100]，默认为50
     */
    pitch?: number;
    /**
     * 合成音频的背景音
     * 0:无背景音（默认值）
     * 1:有背景音
     */
    bgs?: number;
    /**
     * 设置英文发音方式：
     * 0：自动判断处理，如果不确定将按照英文词语拼写处理（缺省）
     * 1：所有英文按字母发音
     * 2：自动判断处理，如果不确定将按照字母朗读
     * 默认按英文单词发音
     */
    reg?: number;
    /**
     * 合成音频数字发音方式
     * 0：自动判断（默认值）
     * 1：完全数值
     * 2：完全字符串
     * 3：字符串优先
     */
    rdn?: string;
  }
}

export = XFYunTTS;
