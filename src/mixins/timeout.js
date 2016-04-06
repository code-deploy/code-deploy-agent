import util from 'util';
import assert from 'assert';
import config from '../config';
import log from '../logger'

export default function mixind(Composed) {

  return class extends Composed {

    delay(time, cb) {
      this.setMeta('expiredAt', time)
      this._clearTimeout();

      this.expiredHandle = setTimeout(cb, time)
      log.info(`Task ${this.id} set timeout delay ${time} millseconds`);
    }

    delayAt(time, cb) {
      this.delay(time - Date.now(), cb);
    }

    _clearTimeout() {
      if (this.expiredHandle) { clearTimeout(this.expiredHandle); }
    }

  }
}
