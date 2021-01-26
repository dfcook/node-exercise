const R = require('ramda');

const handler = (event, context) => {
  const json = JSON.parse(event.body)
  const relevantOrders = R.filter(o => o.OMS_ORDER_ID === o.O_ID, json.ORDERS)

  return {
    CANCELLATIONS: R.filter(o => R.all(li => li.QUANTITY === '0', o.ORDER_LINES), relevantOrders),
    FULFILMENTS: R.filter(o => R.any(li => li.QUANTITY !== '0', o.ORDER_LINES), relevantOrders),
  }
}

module.exports = handler
