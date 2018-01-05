const log = require('@collectai/node-logger')('nats-example:consumer:orderer')
const bigInt = require('big-integer');
let lastSeq;

function isNextEvent(msg) {
  try {
    // NOTE: The seq is a uint64 data type. We have to treat this carefully in node.
    const seq = msg.getSequence()
    const data = msg.getData()
    log.trace('Validating incomming event sequence number: %s', seq)

    if (!isNextMsg(seq)) {
      const next = getNext(lastSeq)
      log.warning('Unordered event sequence: %s, waiting for: %s', seq, lastSeq)
      return false
    } else {
      lastSeq = bigInt(`${seq}`)
      log.trace('Updating last processed sequence to: %s', lastSeq)
      return true
    }
  } catch (err) {
    return false
  }
};

function isNextMsg(current) {
  if (lastSeq) {
    return bigInt(`${current}`).minus(`${lastSeq}`).eq(1)
  }
  return true
};

// REVISIT: what to do when an older sequence number is detected
function isOldMsg(seq) {
  if (lastSeq && seq) {
    return bigInt(seq).lesser(lastSeq)
  }
  return false
};

function getNext(seq) {
  return bigInt(`${seq}`).plus(1).toString()
};

module.exports = {
  isNextEvent
};
