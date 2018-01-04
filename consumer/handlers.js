const { isDuplicated, isNextEvent } = require('./utils')

function onMessageReceived(msg) {
  const sequence = msg.getSequence()
  const data = JSON.parse(msg.getData())
  if (shouldBeProcessed(msg)) {

    log.info('Processing message with sequence %s', sequence)
    log.trace('Message[%s]: %o', sequence, data)

    if(isDuplicated(msg)) {
      log.warning('Duplicated message with id: %id, not processing', data.eventId)
      return
    }
    if(!isNextEvent(msg)) {
      // REVISIT: request event that should come next on demand using setStartAtSequence to reduce waiting time
      log.warning('Unordered event, stalling message')
      return
    }

    // Add business logic here
    msg.ack()
    return
  }
};

module.exports = { onMessageReceived };
