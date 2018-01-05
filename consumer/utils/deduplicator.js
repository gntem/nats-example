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
  }

  return result;
};

module.exports = {
  isDuplicated,
};
