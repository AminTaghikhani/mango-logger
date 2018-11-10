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
const BARACDATA = (data) => `[${data}]`
const BARACTITLE = (title, data) => `[${title}] ${data}`
const BARAC = (title, data) => `[${title}] [${data}]`
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
  str += BARACDATA(type)
  str += VERTICALSPACE;
  str += BARAC('client', req ? GETIP(req) : '0.0.0.0')
  str += VERTICALSPACE;
  str += message;
  str += BREAKLINE;
  return str;
}
const REQUESTLOGSTRINGBUILDER = (req) => {
  let str = '';
  str += DATESTRING();
  str += VERTICALSPACE;
  str += BARAC('client', req ? GETIP(req) : '0.0.0.0')
  str += VERTICALSPACE;
  str += BARACTITLE('url', req.url)
  str += VERTICALSPACE;
  str += BARACTITLE('method', req.method)
  str += VERTICALSPACE;
  str += BARACTITLE('body', JSON.stringify(req.body))
  str += VERTICALSPACE;
  str += BARACTITLE('query', JSON.stringify(req.query))
  str += BREAKLINE;
  return str;
}
const SAVETOFILE = (root, title, data) => {
  Utils.checkDirSync(`${root}/${title}s`);
  Utils.createFileSync(`${root}/${title}s/${title}${EXT}`, data);
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
    SAVETOFILE(this.root, title, LOGSTRINGBUILDER(type, message, req))
  }
  errorToFile(title, error, req = null) {
    if (typeof title !== 'string')
      throw new TypeError('argument title must be a string')
    SAVETOFILE(this.root, title, LOGSTRINGBUILDER('error', error, req))
  }

  objToFile(title, type, obj, req = null) {
    if (typeof title !== 'string')
      throw new TypeError('argument title must be a string')
    if (typeof type !== 'string')
      throw new TypeError('argument type must be a string')
    SAVETOFILE(this.root, title, LOGSTRINGBUILDER(type, JSON.stringify(obj), req))
  }

  requestToFile(req, duration = null) {
    SAVETOFILE(this.root, 'request', REQUESTLOGSTRINGBUILDER(req, duration))
  }
  request(options) {
    if (options)
      if (options.root) {
        if (typeof options.root !== 'string')
          throw new TypeError('argument title must be a string')
        else {
          this.root = options.root;
          if (!fs.existsSync(this.root)) {
            fs.mkdirSync(this.root);
          }
        }
      }
    const thisObj = this;
    return function reqToFile(req, res, next) {
      console.log(req.params);

      thisObj.requestToFile(req);
      next();
    };
  }
}

module.exports = Logger;