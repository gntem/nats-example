function onMessageReceived(msg) {
  if (shouldBeProcessed(msg)) {
    console.log('Processing message %o', msg)
    // Add business logic here
    msg.ack()
  }
};

module.exports = { onMessageReceived };
