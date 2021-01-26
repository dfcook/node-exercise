const R = require('ramda');

const handler = (event, context) => {
  const json = JSON.parse(event.body)
  return {
    ORDERS: R.filter(o => o.OMS_ORDER_ID  === o.O_ID, json.ORDERS)
  }
}

module.exports = handler
