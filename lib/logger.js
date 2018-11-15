const fs = require('fs');
const {
  SAVETOFILE,
  SAVETOFILEDATE,
  REQUESTLOGSTRINGBUILDER,
  LOGSTRINGBUILDER
} = require('./helper')

const ROOTDIR = './logs';

class Logger {
  constructor(options = null) {
    this.options = {
      root: ROOTDIR,
      saveToFile: SAVETOFILE
    }
    if (options) {
      if (typeof options !== 'object')
        throw new TypeError('argument options must be a object')
      if (options.root) {
        if (typeof options.root !== 'string')
          throw new TypeError('argument title must be a string')
        this.options.root = options.root
      }
      if (options.saveFormat) {
        if (typeof options.saveFormat !== 'string')
          throw new TypeError('argument title must be a string')
        else {
          if (options.saveFormat.toLocaleLowerCase() === 'date')
            this.options.saveToFile = SAVETOFILEDATE
          else if (options.saveFormat.toLocaleLowerCase() === 'single')
            this.options.saveToFile = SAVETOFILE
          else
            this.options.saveToFile = SAVETOFILE
        }
      }
    }

    if (!fs.existsSync(this.options.root)) {
      fs.mkdirSync(this.options.root);
    }
  }
  toFile(title, type, message, req = null) {
    if (typeof title !== 'string')
      throw new TypeError('argument title must be a string')
    if (typeof type !== 'string')
      throw new TypeError('argument type must be a string')
    this.options.saveToFile(this.options.root, title, LOGSTRINGBUILDER(type, message, req))
  }
  errorToFile(title, error, req = null) {
    if (typeof title !== 'string')
      throw new TypeError('argument title must be a string')
    SAVETOFILE(this.options.root, title, LOGSTRINGBUILDER('error', error, req))
  }

  objToFile(title, type, obj, req = null) {
    if (typeof title !== 'string')
      throw new TypeError('argument title must be a string')
    if (typeof type !== 'string')
      throw new TypeError('argument type must be a string')
    this.options.saveToFile(this.options.root, title, LOGSTRINGBUILDER(type, JSON.stringify(obj), req))
  }

  requestToFile(req, res) {
    res.on('finish', () => {
      this.options.saveToFile(this.options.root, 'request', REQUESTLOGSTRINGBUILDER(req, res))
    })
  }
  request(options = null) {
    if (options) {
      if (options.root) {
        if (typeof options.root !== 'string')
          throw new TypeError('argument title must be a string')
        else {
          this.options.root = options.root;
          if (!fs.existsSync(this.options.root)) {
            fs.mkdirSync(this.options.root);
          }
        }
      } else {
        this.options.root = ROOTDIR;
      }
      if (options.saveFormat) {
        if (typeof options.saveFormat !== 'string')
          throw new TypeError('argument title must be a string')
        else {
          if (options.saveFormat.toLocaleLowerCase() === 'date')
            this.options.saveToFile = SAVETOFILEDATE
          else if (options.saveFormat.toLocaleLowerCase() === 'single')
            this.options.saveToFile = SAVETOFILE
          else
            this.options.saveToFile = SAVETOFILE
        }
      } else
        this.options.saveToFile = SAVETOFILE
    }
    const thisObj = this;
    return function reqToFile(req, res, next) {
      thisObj.requestToFile(req, res);
      next();
    };
  }
}

module.exports = Logger;