const fs = require('fs')
const { isArray } = require('util')
const handler = require('./handler')

const event = {
  body: fs.readFileSync('./fixtures/shipments.json', 'utf8')
}

const context = {
  accountReference: 'acme'
}

describe('Handler', () => {
  it('Parses the event data into JSON', () => {
    const data = handler(event, context)

    const { ORDERS: orders } = data
    expect(Array.isArray(orders)).toBe(true);

    const [order] = orders
    expect(order.O_ID).toEqual('12345')
  })

  it('Filters out irrelevant orders', () => {
    const data = handler(event, context)

    const { ORDERS: orders } = data
    expect(orders.length).toEqual(2)

    const [order] = orders
    expect(order.O_ID).toEqual('12345')
  })
})