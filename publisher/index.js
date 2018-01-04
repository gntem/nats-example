const log = require('@collectai/node-logger')('nats-example:publisher')

async function start() {
  log.debug('Publishing events')
}

module.exports = {
  start
}
