const log = require('@collectai/node-logger')('nats-example:consumer')

const config = require('./config')
const utils = require('./utils')
const nats = require('./nats')

const { onMessageReceived } = require('./handlers')

async function start() {

  const natsConnection = nats(config)
  natsConnection.listen(onMessageReceived)
  log.info('Consuming events...')

}
module.exports = {
  start,
};
