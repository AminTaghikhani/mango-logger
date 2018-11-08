const fs = require('fs');
const moment = require('moment');
const Utils = require('./utils')
const ROOTDIR = './logs';
const EXT = '.log';
const DATESTRING = () => {
  return `[${moment().format('ddd MMM D HH:mm:ss YYYY')}]`
}
const BREAKLINE = '\n'
const VERTICALSPACE = '\t'
const BARAC = (data) => `[${data}]`
const BARACTITLE = (title, data) => `[${title} ${data}]`
const GETIP = (req) => {
  return req.ip ||
    req._remoteAddress ||
    (req.connection && req.connection.remoteAddress) ||
    undefined
}

const LOGSTRINGBUILDER = (type, message, req = null) => {
  let str = '';
  str += DATESTRING();
  str += VERTICALSPACE;
  str += BARAC(type)
  str += VERTICALSPACE;
  str += BARACTITLE('client', req ? GETIP(req) : '0.0.0.0')
  str += VERTICALSPACE;
  str += message;
  str += BREAKLINE;
  return str;
}

class Logger {
  constructor(root = null) {
    if (root && typeof root !== 'string')
      throw new TypeError('argument root must be a string')
    this.root = root ? root : ROOTDIR
    if (!fs.existsSync(this.root)) {
      fs.mkdirSync(this.root);
    }
  }

  toFile(title, type, message, req = null) {
    if (typeof title !== 'string')
      throw new TypeError('argument title must be a string')
    if (typeof type !== 'string')
      throw new TypeError('argument type must be a string')

    Utils.checkDirSync(`${this.root}/${title}s`);
    Utils.createFileSync(`${this.root}/${title}s/${title}${EXT}`, LOGSTRINGBUILDER(type, message, req));
  }
}

module.exports = Logger;