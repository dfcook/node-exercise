const fs = require('fs')
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

    const { SUCCESS: success, CANCELLATIONS: cancellations, FULFILMENTS: fulfilments } = data

    expect(success).toBe(true)
    expect(Array.isArray(cancellations)).toBe(true)
    expect(Array.isArray(fulfilments)).toBe(true)
  })

  it('Filters out irrelevant orders', () => {
    const data = handler(event, context)

    const { SUCCESS: success, CANCELLATIONS: cancellations, FULFILMENTS: fulfilments } = data

    expect(success).toBe(true)
    expect(cancellations.length + fulfilments.length).toEqual(2)
  })

  it('Splits orders into cancellations and fulfilments', () => {
    const data = handler(event, context)

    const { SUCCESS: success, CANCELLATIONS: cancellations, FULFILMENTS: fulfilments } = data

    expect(success).toBe(true)

    expect(cancellations.length).toEqual(1)
    expect(fulfilments.length).toEqual(1)

    const [fulfilled] = fulfilments
    expect(fulfilled.O_ID).toEqual('12345')

    const [cancelled] = cancellations
    expect(cancelled.O_ID).toEqual('500324412')
  })

  it('handles null event', () => {
    const data = handler(null)

    const { SUCCESS: success, ERROR_MSG: msg } = data
    expect(success).toBe(false)
    expect(msg).toEqual('Empty event payload received')
  })

  it('handles null body', () => {
    const data = handler({ body: null })

    const { SUCCESS: success, ERROR_MSG: msg } = data
    expect(success).toBe(false)
    expect(msg).toEqual('No body in event payload')
  })

  it('handles missing orders', () => {
    const data = handler({ body: '{}' })

    const { SUCCESS: success, ERROR_MSG: msg } = data
    expect(success).toBe(false)
    expect(msg).toEqual('No orders in event body')
  })

  it('handles orders with no lines', () => {
    const data = handler({ body: '{ "ORDERS": [{}, {}]}' })

    const { SUCCESS: success, ERROR_MSG: msg } = data

    expect(success).toBe(false)
    expect(msg).toEqual('Cannot read property \'any\' of undefined')
  })
})