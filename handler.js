const R = require('ramda')

const { chain } = require('stream-chain')

const { pick } = require('stream-json/filters/Pick')
const { parser } = require('stream-json')
const { streamArray } = require('stream-json/streamers/StreamArray')

const handler = (event, { onCancellation, onFulfilment }) => {
  return new Promise((resolve, reject) => {
    try {
      if (!event || !event.body) {
        reject('Empty event payload received')
      }

      const pipeline = chain([
        event.body,
        parser(),
        pick({ filter: 'ORDERS' }),
        streamArray(),
        ({ value }) => {
          if (value.O_ID === value.OMS_ORDER_ID) {
            return value
          }
        },
      ])

      pipeline
        .on('data', (order) => {
          if (
            R.any((ol) => ol.QUANTITY !== '0', order.ORDER_LINES) &&
            onFulfilment
          ) {
            onFulfilment(order)
          } else if (onCancellation) {
            onCancellation(order)
          }
        })
        .on('finish', () => resolve())
    } catch (e) {
      reject(e.message)
    }
  })
}

module.exports = handler
