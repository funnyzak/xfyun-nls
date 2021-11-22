'use strict';

const CryptoJS = require('crypto-js');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const assert = require('assert');

class XFYunTTS {
  constructor(config, cachePath) {
    assert(config, 'must pass "config"');
    assert(config.appId, 'must pass "config.appId"');
    assert(config.apiSecret, 'must pass "config.apiSecret"');
    assert(config.apiKey, 'must pass "config.apiKey"');
    assert(config.host, 'must pass "config.host"');
    assert(config.uri, 'must pass "config.uri"');
    assert(config.hostUrl, 'must pass "config.hostUrl"');
    // assert(config.cachePath, 'must pass "cachePath"');
    // if (!fs.existsSync(cachePath)) {
    //   throw new Error(`"cachePath" - ${cachePath} is not exist.`);
    // }

    if (!cachePath) {
      cachePath = path.join(process.cwd(), new Date().getTime());
      fs.mkdirSync(cachePath);
    }

    this.ws = null;
    this.config = config;
    this.cachePath = cachePath;
    this.defaultBusinessOption = {
      aue: 'lame',
      sfl: 1,
      auf: 'audio/L16;rate=16000',
      vcn: 'xiaoyan',
      speed: 50,
      volume: 50,
      pitch: 50,
      bgs: 0,
      tte: 'UTF8',
      rdn: '0'
    };

    /**
     * 当前处理对象的高级配置
     */
    this.businessOption = { ...this.defaultBusinessOption };

    /**
     * WS 数据接受次数
     */
    this.receiveCount = 0;
  }

  /**
   * 打印
   * @param {*} msg
   * @param {*} level
   */
  log(msg, level = 'info') {
    const message = typeof msg !== 'string' ? JSON.stringify(msg) : msg;

    const warning = (_message) => chalk`{yellow WARNING:} ${_message}`;
    const info = (_message) => chalk`{magenta INFO:} ${_message}`;
    const error = (_message) => chalk`{red ERROR:} ${_message}`;
    switch (level) {
      case 'error':
        console.info(error(message));
        break;
      case 'warn':
        console.warn(warning(message));
        break;
      default:
        console.info(info(message));
        break;
    }
  }

  /**
   * 当前时间 RFC1123格式
   * @returns
   */
  rtcNow() {
    return new Date().toUTCString();
  }

  /**
   * 获取当前WSS URL
   * @returns
   */
  getWssUrl() {
    const _rtcNow = this.rtcNow();
    const wssUrl = `${this.config.hostUrl}?authorization=${this.signature(
      _rtcNow
    )}&date=${_rtcNow}&host=${this.config.host}`;
    this.log(`Wss URL: ${wssUrl}.`);
    return wssUrl;
  }

  /**
   * 网络检查配置是否正确
   * @returns
   */
  async checkConfig() {
    try {
      await this.send('Hello World');
      return true;
    } catch (error) {
      this.log(`check config error: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * 接受音频流
   * @returns
   */
  receive(fileSavePath) {
    this.log(`will save audio path: ${fileSavePath}.`);

    return new Promise((resolve, reject) => {
      if (this.ws === null) {
        reject(new Error('ws is null.'));
        return;
      }

      this.ws.onmessage = (ev) => {
        this.log(`ws received data: ${ev.data}.`);

        const res = JSON.parse(ev.data);
        if (res.code !== 0) {
          reject(new Error(`${res.code}: ${res.message}.`));
          this.ws.close();
          return;
        }

        const { audio } = res.data;
        if (audio !== null) {
          const audioBuf = Buffer.from(audio, 'base64');
          fs.writeFile(fileSavePath, audioBuf, { flag: 'a' }, (err) => {
            if (err) {
              reject(err);
              return;
            }
            this.log(`The file has been append!`);
          });
          this.receiveCount++;
        }

        if (res.code === 0 && res.data.status === 2) {
          this.ws.close();
          if (this.receiveCount > 0) {
            this.log(`file has been saved to path: ${fileSavePath}`);
            resolve(fileSavePath);
          } else {
            reject(new Error('receive error, maybe check speaker type.'));
          }
        }
      };
    });
  }

  /**
   * 重置配置
   */
  reset() {
    this.ws = new WebSocket(this.getWssUrl());
    this.receiveCount = 0;
    this.businessOption = { ...this.defaultBusinessOption };
  }

  /**
   * 合成语音
   * @param {*} text 合成文本
   * @param {*} options 高级业务设置
   * @returns
   */
  send(text, options = {}) {
    this.reset();

    this.businessOption = {
      ...this.defaultBusinessOption,
      ...options
    };

    return new Promise((resolve, reject) => {
      const _startTS = new Date().getTime();

      this.ws.onopen = () => {
        this.log(
          `task => text: ${text}, options: ${JSON.stringify(
            this.businessOption
          )}`
        );

        const frame = {
          common: {
            app_id: this.config.appId
          },
          business: { ...this.businessOption },
          data: {
            text: Buffer.from(text).toString('base64'),
            status: 2
          }
        };
        this.log(`ws send: ${JSON.stringify(frame)}`);
        this.ws.send(JSON.stringify(frame));
      };

      this.ws.onclose = () => {
        this.log('ws closed.');
      };

      this.ws.onerror = (ev) => {
        this.log(`ws error. data: ${JSON.stringify(ev)}`);
        reject(new Error(`ws onerror handle. data: ${JSON.stringify(ev)}`));
      };

      const filePath = this.randomSavePath();
      this.receive(filePath)
        .then(() => {
          resolve({
            filePath,
            text,
            startTime: _startTS,
            options: this.businessOption,
            rootPath: this.cachePath,
            suffix: path.extname(filePath).substring(1),
            elapsed: new Date().getTime() - _startTS
          });
        })
        .catch((err) => {
          this.log(`receive error: ${err.message}.`, 'error');
          reject(err);
        });
    });
  }

  /**
   * 随机保存路径
   * @returns
   */
  randomSavePath() {
    return path.join(
      this.cachePath,
      `${new Date().getTime().toString()}.${
        this.businessOption.aue === 'raw'
          ? 'pcm'
          : this.businessOption.aue === 'lame'
          ? 'mp3'
          : this.businessOption.aux.startsWith('speex')
          ? 'speex'
          : 'audio'
      }`
    );
  }

  /**
   * @param date  鉴权签名
   * @returns
   */
  signature(date) {
    const signatureOrigin = `host: ${this.config.host}\ndate: ${date}\nGET ${this.config.uri} HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(
      signatureOrigin,
      this.config.apiSecret
    );
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${this.config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authStr = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(authorizationOrigin)
    );
    return authStr;
  }
}

module.exports = XFYunTTS;
