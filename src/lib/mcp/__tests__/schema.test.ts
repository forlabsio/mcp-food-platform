import { TOOLS } from '../schema'

describe('MCP schema TOOLS', () => {
  it('has 3 entries', () => {
    expect(TOOLS).toHaveLength(3)
  })

  it('each tool has name, description, and inputSchema', () => {
    for (const tool of TOOLS) {
      expect(tool).toHaveProperty('name')
      expect(tool).toHaveProperty('description')
      expect(tool).toHaveProperty('inputSchema')
      expect(typeof tool.name).toBe('string')
      expect(typeof tool.description).toBe('string')
      expect(tool.inputSchema.type).toBe('object')
      expect(tool.inputSchema).toHaveProperty('properties')
      expect(tool.inputSchema).toHaveProperty('required')
      expect(Array.isArray(tool.inputSchema.required)).toBe(true)
    }
  })

  it('tool names match expected values', () => {
    const names = TOOLS.map((t) => t.name)
    expect(names).toEqual(['get_menu', 'place_order', 'check_order_status'])
  })

  it('get_menu requires restaurant_id', () => {
    const getMenu = TOOLS.find((t) => t.name === 'get_menu')!
    expect(getMenu.inputSchema.required).toContain('restaurant_id')
    expect(getMenu.inputSchema.properties).toHaveProperty('restaurant_id')
  })

  it('place_order requires restaurant_id, items, customer_name, customer_phone', () => {
    const placeOrder = TOOLS.find((t) => t.name === 'place_order')!
    expect(placeOrder.inputSchema.required).toEqual(
      expect.arrayContaining([
        'restaurant_id',
        'items',
        'customer_name',
        'customer_phone',
      ])
    )
  })

  it('check_order_status requires order_id', () => {
    const checkStatus = TOOLS.find((t) => t.name === 'check_order_status')!
    expect(checkStatus.inputSchema.required).toContain('order_id')
    expect(checkStatus.inputSchema.properties).toHaveProperty('order_id')
  })
})
