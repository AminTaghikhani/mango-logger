const {
    LOGGER
} = require('../index')

try {
    throw new RangeError('out of range')
} catch (error) {
    LOGGER.errorToFile('test', error)
    LOGGER.toFile('test', 'sdf', error)
}

LOGGER.objToFile('test', 'error', {
    a: 123,
    b: 'asd'
})