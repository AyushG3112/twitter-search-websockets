isNullOrUndefined = require('util').isNullOrUndefined;

class TwitterSearcher {
  constructor(port) {
    this._port = port;
  }

  setEventEmitter(eventEmitter) {
    this._eventEmitter = eventEmitter;
  }

  setKeyword(keyword) {
    this._keyword = keyword;
  }

  getKeyword() {
    return this._keyword;
  }

  start() {
    if (!this._eventEmitter) {
      throw new Error('No Event Emitter Attached');
    }
    if (isNullOrUndefined(this._keyword)) {
      throw new Error('No Keyword To Search For');
    }
    if (this._intervalTimer) {
      clearInterval(this._intervalTimer);
    }
    this._intervalTimer = setInterval(
      keyword => {
        this._eventEmitter.emit(keyword, { status: true, keyword });
      },
      100,
      this._keyword
    );
  }

  stop() {
    if (this._intervalTimer) {
      clearInterval(this._intervalTimer);
    }
  }
}

module.exports = TwitterSearcher;
