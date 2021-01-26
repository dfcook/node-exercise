const R = require('ramda');

const success = (fulfilments, cancellations) => ({
  SUCCESS: true,
  CANCELLATIONS: cancellations,
  FULFILMENTS: fulfilments
})

const fail = (msg) => ({
  SUCCESS: false,
  ERROR_MSG: msg
})

const handler = (event, context) => {
  try {
    if (!event) {
      return fail('Empty event payload received')
    }

    const body = JSON.parse(event.body)

    if (!body) {
      return fail('No body in event payload')
    }

    if (!body.ORDERS) {
      return fail('No orders in event body')
    }

    const relevantOrders = R.filter(o => o.OMS_ORDER_ID === o.O_ID, body.ORDERS)

    const split = R.partition(o => R.any(li => li.QUANTITY !== '0', o.ORDER_LINES), relevantOrders)
    return success(split[0], split[1])
  } catch (e) {
    return fail(e.message)
  }
}

module.exports = handler
