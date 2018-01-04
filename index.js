const publisher = require('./publisher')
const consumer = require('./consumer')

publisher.start().then(() => consumer.start())

