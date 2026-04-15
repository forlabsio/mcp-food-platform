import { generateSkillJson } from '../generate-skill-json'
import type { Restaurant } from '@/types/database'

const mockRestaurant: Restaurant = {
  id: 'rest-001',
  name: '맛있는 김치찌개',
  description: '정통 한식 김치찌개 전문점',
  address: '서울특별시 강남구 테헤란로 123',
  phone: '02-1234-5678',
  business_hours: '매일 11:00 - 21:00',
  category: '한식',
  image_url: 'https://example.com/image.jpg',
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
}

const mcpUrl = 'https://mcp.example.com/sse'

describe('generateSkillJson', () => {
  it('generates valid JSON with correct restaurant_id in const fields', () => {
    const result = generateSkillJson(mockRestaurant, mcpUrl) as Record<string, unknown>

    expect(result.name).toBe('맛있는 김치찌개')
    expect(result.description).toBe('맛있는 김치찌개 AI 주문 에이전트')
    expect(result.version).toBe('1.0.0')

    // get_menu tool has restaurant_id const
    const tools = result.tools as Array<Record<string, unknown>>
    const getMenu = tools.find((t) => t.name === 'get_menu')!
    const getMenuSchema = getMenu.inputSchema as Record<string, unknown>
    const getMenuProps = getMenuSchema.properties as Record<string, Record<string, unknown>>
    expect(getMenuProps.restaurant_id.const).toBe('rest-001')

    // place_order tool has restaurant_id const
    const placeOrder = tools.find((t) => t.name === 'place_order')!
    const placeOrderSchema = placeOrder.inputSchema as Record<string, unknown>
    const placeOrderProps = placeOrderSchema.properties as Record<string, Record<string, unknown>>
    expect(placeOrderProps.restaurant_id.const).toBe('rest-001')
  })

  it('contains all 3 tools', () => {
    const result = generateSkillJson(mockRestaurant, mcpUrl) as Record<string, unknown>
    const tools = result.tools as Array<Record<string, unknown>>

    expect(tools).toHaveLength(3)

    const toolNames = tools.map((t) => t.name)
    expect(toolNames).toContain('get_menu')
    expect(toolNames).toContain('place_order')
    expect(toolNames).toContain('check_order_status')
  })

  it('MCP URL is correctly set', () => {
    const result = generateSkillJson(mockRestaurant, mcpUrl) as Record<string, unknown>
    const mcp = result.mcp as Record<string, unknown>

    expect(mcp.url).toBe(mcpUrl)
    expect(mcp.transport).toBe('streamable-http')
  })

  it('tool input schemas have required fields', () => {
    const result = generateSkillJson(mockRestaurant, mcpUrl) as Record<string, unknown>
    const tools = result.tools as Array<Record<string, unknown>>

    // get_menu
    const getMenu = tools.find((t) => t.name === 'get_menu')!
    const getMenuSchema = getMenu.inputSchema as Record<string, unknown>
    expect(getMenuSchema.required).toEqual(['restaurant_id'])

    // place_order
    const placeOrder = tools.find((t) => t.name === 'place_order')!
    const placeOrderSchema = placeOrder.inputSchema as Record<string, unknown>
    expect(placeOrderSchema.required).toEqual([
      'restaurant_id',
      'items',
      'customer_name',
      'customer_phone',
    ])

    // check_order_status
    const checkStatus = tools.find((t) => t.name === 'check_order_status')!
    const checkStatusSchema = checkStatus.inputSchema as Record<string, unknown>
    expect(checkStatusSchema.required).toEqual(['order_id'])
  })

  it('place_order items schema has correct structure', () => {
    const result = generateSkillJson(mockRestaurant, mcpUrl) as Record<string, unknown>
    const tools = result.tools as Array<Record<string, unknown>>
    const placeOrder = tools.find((t) => t.name === 'place_order')!
    const schema = placeOrder.inputSchema as Record<string, unknown>
    const props = schema.properties as Record<string, Record<string, unknown>>

    expect(props.items.type).toBe('array')
    expect(props.customer_name.type).toBe('string')
    expect(props.customer_phone.type).toBe('string')
  })
})
