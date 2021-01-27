const fs = require('fs')
const handler = require('./handler')

const createEvent = (fileName = './fixtures/shipments.json') => ({
  body: fs.createReadStream(fileName, 'utf8'),
})

const createContext = () => ({
  accountReference: 'acme',
  onCancellation: jest.fn(),
  onFulfilment: jest.fn(),
})

describe('Handler', () => {
  it('Calls correct handler when cancellations encountered', async () => {
    const context = createContext()

    await handler(createEvent(), context)
    expect(context.onCancellation).toHaveBeenCalledWith(
      jasmine.objectContaining({
        O_ID: '500324412',
      })
    )
  })

  it('Calls correct handler when fulfilment encountered', async () => {
    const context = createContext()
    await handler(createEvent(), context)
    expect(context.onFulfilment).toHaveBeenCalledWith(
      jasmine.objectContaining({
        O_ID: '12345',
      })
    )
  })

  // https://jestjs.io/docs/en/expect.html#rejects
  it('throws on null event', async () => {
    await expect(handler(null)).rejects.toEqual(
      new Error('Empty event payload received')
    )
  })

  it('throws on null body', async () => {
    await expect(handler({ body: null })).rejects.toEqual(
      new Error('Empty event payload received')
    )
  })

  it('throws on null context', async () => {
    await expect(handler(createEvent())).rejects.toEqual(
      new Error('No contextual information received')
    )
  })

  it('throws on empty file', async () => {
    await expect(
      handler(createEvent('./fixtures/empty.json'), createContext())
    ).rejects.toEqual(new Error('Parser has expected a value'))
  })
})
