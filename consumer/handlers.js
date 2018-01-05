const log = require('@collectai/node-logger')('nats-example:consumer:handlers')
const {
  isDuplicated,
  isNextEvent
} = require('./utils')

function onMessageReceived(msg) {
  const sequence = msg.getSequence()
  const data = JSON.parse(msg.getData())

  log.info('Processing message with sequence %s', sequence)
  log.trace('Message[%s]: %o', sequence, data)

  if (isDuplicated(msg)) return;
  if (!isNextEvent(msg)) return;

  // Add business logic here
  log.debug('Event processed succesfully')
  msg.ack()
  return
};

module.exports = {
  onMessageReceived
};
