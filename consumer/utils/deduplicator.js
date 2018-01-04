const processedEventIds = []

function isDuplicated(msg) {
  const data = msg.getData();
  const payload = JSON.parse(data)
  const {
    eventId
  } = payload

  return processedEventIds.includes(eventId)
}

module.exports = isDuplicated