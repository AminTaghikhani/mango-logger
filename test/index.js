const {
    LOGGER
} = require('../index')

try {
    throw new RangeError('out of range')
} catch (error) {
    LOGGER.errorToFile('test', error)
    LOGGER.toFile('test', 'sdf', error)
}

// LOGGER.objToFile('test', 'error', {
//     a: 123,
//     b: 'asd'
// })
var code = 5
var e = {code:5};
LOGGER.objToFile('code','info', {
    code,
    uCode: e.code,
  });
