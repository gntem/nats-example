const log = require('@collectai/node-logger')('nats-example:consumer:orderer')
const processedEventIds = []

function isDuplicated(msg) {
  const data = msg.getData();
  const payload = JSON.parse(data)

  const {
    eventId
  } = payload;

  log.trace('Validating event uniqueness for eventId: %s', eventId);
  const result = processedEventIds.includes(eventId)

  if (result) {
    log.warning('Detected duplicated eventId: %s', eventId);
  } else {
    processedEventIds.push(eventId);
  }

  return result;
};

process.on('SIGINT', () => {
  log.debug('Total events processed: %s', processedEventIds.length)
  log.trace('Events processed: %s', processedEventIds.toString())

  process.exit()
})


module.exports = {
  isDuplicated,
};
