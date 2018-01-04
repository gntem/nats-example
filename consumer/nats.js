const log = require('@collectai/node-logger')
const colors = require('colors');
const bigInt = require('big-integer');
const nats = require('node-nats-streaming');

let lastSeq
let durableSub
let config

function listen(onMessageReceived) {
  const { connectionOptions } = config

  const {
    clusterId,
    clientId,
    url
  } = connectionOptions

  const client = nats.connect(clusterId, clientId, { url })

  client.on('connect', () => {
    log.info('Successfully connected to nats cluster')
    initSubscribtion(client, onMessageReceived)
  })

  client.on('error', (error) => {
    console.log('natsClient error, %s', error.toString())
  })

  client.on('reconnecting', () => {
    console.log('attempting to reconnect to cluster')
  })

  client.on('reconnect', () => {
    log.debug('connection to cluster reestablished')
    // Create the durable subscription if it was never subscribed before losing the connection
    if (durableSub === undefined) {
      initSubscribtion(client, onMessageReceived)
    }
  })

  client.on('disconnect', () => {
    log.debug('disconnected from cluster')
  })

  client.on('close', () => {
    log.debug('connection to cluster closed')
  })
}

function initSubscribtion(client, onMessageReceived) {
  const {
    subject,
    subscriptionOptions
  } = config
  const opts = parseSubscriptionOptions(client, subscriptionOptions)
  durableSub = client.subscribe(subject, null, opts)
  durableSub.on('message', onMessageReceived)
}

function parseSubscriptionOptions(client, subscriptionOptions) {
  const opts = client.subscriptionOptions()
  Object.keys(subscriptionOptions).forEach((option) => {
    const fn = opts[option];
    const argValue = subscriptionOptions[option]
    const args = typeof argValue === 'array' ? argValue : [argValue]
    if (typeof fn !== 'function') {
      console.debug('Invalid subscription option: %s', option)
      return
    }
    fn.apply(client, args)
  })

  return opts
}

function close() {
  if (durableSub === undefined) {
    console.log('Not yet subscribed, nothing to close')
    return false
  }
  if (durableSub.isClosed() === true) {
    console.log('Subscription already closed')
    return false
  }
  durableSub.close()
  return true
}

module.exports = (_config) => {
  config = _config
  return {
    listen,
    close,
  }
}
