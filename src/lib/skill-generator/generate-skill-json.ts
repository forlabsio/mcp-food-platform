import type { Restaurant } from '@/types/database'

export function generateSkillJson(
  restaurant: Restaurant,
  mcpServerUrl: string,
): object {
  return {
    name: restaurant.name,
    description: `${restaurant.name} AI 주문 에이전트`,
    version: '1.0.0',
    mcp: {
      url: mcpServerUrl,
      transport: 'streamable-http',
    },
    tools: [
      {
        name: 'get_menu',
        description: '메뉴를 조회합니다',
        inputSchema: {
          type: 'object',
          properties: {
            restaurant_id: { type: 'string', const: restaurant.id },
          },
          required: ['restaurant_id'],
        },
      },
      {
        name: 'place_order',
        description: '주문을 생성합니다',
        inputSchema: {
          type: 'object',
          properties: {
            restaurant_id: { type: 'string', const: restaurant.id },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  menu_item_id: { type: 'string' },
                  quantity: { type: 'integer', minimum: 1 },
                  options: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        choice: { type: 'string' },
                      },
                    },
                  },
                },
                required: ['menu_item_id', 'quantity'],
              },
            },
            customer_name: { type: 'string' },
            customer_phone: { type: 'string' },
            notes: { type: 'string' },
          },
          required: ['restaurant_id', 'items', 'customer_name', 'customer_phone'],
        },
      },
      {
        name: 'check_order_status',
        description: '주문 상태를 확인합니다',
        inputSchema: {
          type: 'object',
          properties: {
            order_id: { type: 'string' },
          },
          required: ['order_id'],
        },
      },
    ],
  }
}
