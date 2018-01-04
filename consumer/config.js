/* REVISIT:
  *  nats subscription options are set by function calls
  *  subscriptionOptions keys are function names and
  *  values are arguments
  */

module.exports = {
  subject: 'examples.foo',
  connectionOptions: {
    enabled: true,
    clientId: 'client-example-123',
    clusterId: 'cai',
    maxReconnectAttempts: -1,
    reconnectTimeWait: 1000,
    url: 'nats://localhost:4222',
  },
  subscriptionOptions: {
    setDeliverAllAvailable: [true],
    setMaxInFlight: [1],
    setAckWait: [5000],
    setDurableName: ['durable-example'],
    setManualAckMode: [true],
  }
}
