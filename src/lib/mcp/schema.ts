export interface ToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, unknown>
    required: string[]
  }
}

export const TOOLS: ToolDefinition[] = [
  {
    name: 'get_menu',
    description:
      '식당의 메뉴를 조회합니다. 메뉴 아이템, 가격, 옵션 정보를 반환합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        restaurant_id: {
          type: 'string',
          description: '조회할 식당의 고유 ID',
        },
      },
      required: ['restaurant_id'],
    },
  },
  {
    name: 'place_order',
    description:
      '식당에 주문을 생성합니다. 메뉴 아이템, 수량, 옵션, 고객 정보를 받아 주문을 처리합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        restaurant_id: {
          type: 'string',
          description: '주문할 식당의 고유 ID',
        },
        items: {
          type: 'array',
          description: '주문할 메뉴 아이템 목록',
          items: {
            type: 'object',
            properties: {
              menu_item_id: {
                type: 'string',
                description: '메뉴 아이템 ID',
              },
              quantity: {
                type: 'number',
                description: '수량',
                minimum: 1,
              },
              options: {
                type: 'array',
                description: '선택한 옵션 목록',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: '옵션 이름 (예: 사이즈, 맵기)',
                    },
                    choice: {
                      type: 'string',
                      description: '선택한 값 (예: 라지, 보통맵기)',
                    },
                  },
                  required: ['name', 'choice'],
                },
              },
            },
            required: ['menu_item_id', 'quantity'],
          },
        },
        customer_name: {
          type: 'string',
          description: '주문 고객 이름',
        },
        customer_phone: {
          type: 'string',
          description: '주문 고객 전화번호',
        },
        notes: {
          type: 'string',
          description: '주문 메모 (선택)',
        },
      },
      required: ['restaurant_id', 'items', 'customer_name', 'customer_phone'],
    },
  },
  {
    name: 'check_order_status',
    description:
      '주문 상태를 조회합니다. 주문 번호로 현재 진행 상태를 확인합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        order_id: {
          type: 'string',
          description: '조회할 주문 ID',
        },
      },
      required: ['order_id'],
    },
  },
]
