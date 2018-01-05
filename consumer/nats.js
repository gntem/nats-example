const log = require('@collectai/node-logger')('nats-example:consumer:nats')
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
    durableSub = initSubscribtion(client, onMessageReceived)
  })

  client.on('error', (error) => {
    log.error('natsClient error, %s', error.toString())
  })

  client.on('reconnecting', () => {
    log.debug('attempting to reconnect to cluster')
  })

  client.on('reconnect', () => {
    log.debug('connection to cluster reestablished')
    // Create the durable subscription if it was never subscribed before losing the connection
    if (durableSub === undefined) {
      durableSub = initSubscribtion(client, onMessageReceived)
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
  const opts = parseSubscriptionOptions(client, subscriptionOptions);
  const sub = client.subscribe(subject, null, opts);
  sub.on('message', onMessageReceived);
  sub.on('error', (err) => { log.error('An error has occured in subscribtion to %s:o', subject, err) });
  sub.on('ready', (err) => { log.debug('Successfully subscribed to %s', subject) });
  return sub;
}

function parseSubscriptionOptions(client, subscriptionOptions) {
  const opts = client.subscriptionOptions()
  Object.keys(subscriptionOptions).forEach((option) => {
    const fn = opts[option];
    const args = subscriptionOptions[option]
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
    log.debug('Not yet subscribed, nothing to close')
    return false
  }
  if (durableSub.isClosed() === true) {
    log.debug('Subscription already closed')
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
