const fs = require('fs')
const handler = require('./handler')

const createEvent = () => ({
  body: fs.createReadStream('./fixtures/shipments.json', 'utf8'),
})

const createContext = () => ({
  accountReference: 'acme',
  onCancellation: jest.fn(),
  onFulfilment: jest.fn(),
})

describe('Handler', () => {
  it('Calls handler when cancellations encountered', async () => {
    const context = createContext()

    await handler(createEvent(), context)
    expect(context.onCancellation).toHaveBeenCalledWith(
      jasmine.objectContaining({
        O_ID: '500324412',
      })
    )
  })

  it('Calls handler when fulfilment encountered', async () => {
    const context = createContext()
    await handler(createEvent(), context)
    expect(context.onFulfilment).toHaveBeenCalledWith(
      jasmine.objectContaining({
        O_ID: '12345',
      })
    )
  })
})
