const moment = require('moment');
const Utils = require('./utils')
const EXT = '.log';
const DATESTRING = () => {
    return `[${moment().format('ddd MMM D HH:mm:ss YYYY')}]`
}
const DATESTRING2 = () => {
    return moment().format('D-MM-YYYY')
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
const REQUESTLOGSTRINGBUILDER = (req, res) => {
    let str = '';
    str += DATESTRING();
    str += VERTICALSPACE;
    str += BARAC('client', req ? GETIP(req) : '0.0.0.0')
    str += VERTICALSPACE;
    str += BARACTITLE('url', req.url)
    str += VERTICALSPACE;
    str += BARACTITLE('method', req.method)
    str += VERTICALSPACE;
    str += BARACTITLE('status', res.statusCode)
    str += VERTICALSPACE;
    str += BARACTITLE('Content-Length', `${res.get('Content-Length') || 0} b`)
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
const SAVETOFILEDATE = (root, title, data) => {
    Utils.checkDirSync(`${root}/${title}s`);
    Utils.createFileSync(`${root}/${title}s/${DATESTRING2()}${EXT}`, data);
}

module.exports = {
    SAVETOFILE,
    SAVETOFILEDATE,
    REQUESTLOGSTRINGBUILDER,
    LOGSTRINGBUILDER
}