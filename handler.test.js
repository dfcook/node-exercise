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

    const { CANCELLATIONS: cancellations, FULFILMENTS: fulfilments } = data
    expect(Array.isArray(cancellations)).toBe(true)
    expect(Array.isArray(fulfilments)).toBe(true)

    const [order] = fulfilments
    expect(order.O_ID).toEqual('12345')
  })

  it('Filters out irrelevant orders', () => {
    const data = handler(event, context)

    const { CANCELLATIONS: cancellations, FULFILMENTS: fulfilments } = data

    expect(cancellations.length + fulfilments.length).toEqual(2)
  })

  it('Splits orders into cancellations and fulfilments', () => {
    const data = handler(event, context)

    const { CANCELLATIONS: cancellations, FULFILMENTS: fulfilments } = data

    expect(cancellations.length).toEqual(1)
    expect(fulfilments.length).toEqual(1)
  })
})