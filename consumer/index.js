const config = require('./config')
const utils = require('./utils')
const nats = require('./nats')

const { onMessageReceived } = require('./handlers')

// const durableSub =

async function start() {
  console.log('Consuming events')
  const natsConnection = nats(config)
  natsConnection.listen(onMessageReceived)

}
module.exports = {
  start
}
