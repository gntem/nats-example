const bigInt = require('big-integer');
let lastSeq

function isNextEvent(msg) {
  try {
    // NOTE: The seq is a uint64 data type. We have to treat this carefully in node.
    const seq = msg.getSequence()
    const data = msg.getData()

    if (!isNextMsg(seq)) {
      const next = getNext(lastSeq)
      return false
    } else {
      lastSeq = bigInt(`${seq}`)
      return true
    }
  } catch (err) {
    return false
  }
}

function isNextMsg(current) {
  if (lastSeq) {
    return bigInt(`${current}`).minus(`${last}`).eq(1)
  }
  return true
}

function isOldMsg(seq) {
  if (lastSeq && seq) {
    return bigInt(seq).lesser(lastSeq)
  }
  return false
}

function getNext(seq) {
  return bigInt(`${seq}`).plus(1).toString()
}

module.exports = isNextEvent