import { getSupabase } from '@/lib/supabase/client'
import { sendOrderNotification } from '@/lib/kakao/notify'
import type {
  Restaurant,
  MenuItem,
  Order,
  OrderItem,
  MenuOption,
} from '@/types/database'

// --- get_menu ---

interface GetMenuParams {
  restaurant_id: string
}

interface GetMenuResult {
  restaurant: Restaurant
  menu_items: MenuItem[]
}

export async function get_menu(
  params: GetMenuParams
): Promise<GetMenuResult> {
  const { restaurant_id } = params

  const { data: restaurant, error: restaurantError } = await getSupabase()
    .from('restaurants')
    .select('*')
    .eq('id', restaurant_id)
    .single()

  if (restaurantError || !restaurant) {
    throw new Error(`식당을 찾을 수 없습니다: ${restaurant_id}`)
  }

  const { data: menuItems, error: menuError } = await getSupabase()
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant_id)
    .eq('is_available', true)
    .order('category')
    .order('name')

  if (menuError) {
    throw new Error(`메뉴 조회 실패: ${menuError.message}`)
  }

  return {
    restaurant: restaurant as Restaurant,
    menu_items: (menuItems ?? []) as MenuItem[],
  }
}

// --- place_order ---

interface PlaceOrderItemInput {
  menu_item_id: string
  quantity: number
  options?: { name: string; choice: string }[]
}

interface PlaceOrderParams {
  restaurant_id: string
  items: PlaceOrderItemInput[]
  customer_name: string
  customer_phone: string
  notes?: string
}

export async function place_order(params: PlaceOrderParams): Promise<Order> {
  const { restaurant_id, items, customer_name, customer_phone, notes } = params

  if (!items.length) {
    throw new Error('주문 항목이 비어 있습니다.')
  }

  // 1. Fetch restaurant
  const { data: restaurant, error: restaurantError } = await getSupabase()
    .from('restaurants')
    .select('*')
    .eq('id', restaurant_id)
    .eq('is_active', true)
    .single()

  if (restaurantError || !restaurant) {
    throw new Error(`주문 가능한 식당을 찾을 수 없습니다: ${restaurant_id}`)
  }

  // 2. Fetch menu items to validate IDs and get prices
  const menuItemIds = items.map((i) => i.menu_item_id)
  const { data: menuItems, error: menuError } = await getSupabase()
    .from('menu_items')
    .select('*')
    .in('id', menuItemIds)
    .eq('restaurant_id', restaurant_id)
    .eq('is_available', true)

  if (menuError) {
    throw new Error(`메뉴 조회 실패: ${menuError.message}`)
  }

  const menuMap = new Map<string, MenuItem>(
    ((menuItems ?? []) as MenuItem[]).map((m) => [m.id, m])
  )

  // Validate all requested items exist
  for (const item of items) {
    if (!menuMap.has(item.menu_item_id)) {
      throw new Error(
        `메뉴 아이템을 찾을 수 없거나 현재 주문 불가합니다: ${item.menu_item_id}`
      )
    }
  }

  // 3. Build order items and calculate total
  let totalPrice = 0
  const orderItems: OrderItem[] = items.map((input) => {
    const menuItem = menuMap.get(input.menu_item_id)!
    let itemPrice = menuItem.price

    // Resolve option price deltas
    const resolvedOptions: OrderItem['options'] = (input.options ?? []).map(
      (opt) => {
        const menuOption = (menuItem.options ?? []).find(
          (mo: MenuOption) => mo.name === opt.name
        )
        if (!menuOption) {
          throw new Error(
            `옵션 "${opt.name}"이(가) "${menuItem.name}"에 존재하지 않습니다.`
          )
        }
        const choiceData = menuOption.choices.find(
          (c) => c.label === opt.choice
        )
        if (!choiceData) {
          throw new Error(
            `옵션 "${opt.name}"에서 "${opt.choice}" 선택지를 찾을 수 없습니다.`
          )
        }
        itemPrice += choiceData.price_delta
        return {
          name: opt.name,
          choice: opt.choice,
          price_delta: choiceData.price_delta,
        }
      }
    )

    totalPrice += itemPrice * input.quantity

    return {
      menu_item_id: input.menu_item_id,
      name: menuItem.name,
      quantity: input.quantity,
      price: itemPrice,
      options: resolvedOptions,
    }
  })

  // 4. Insert order into Supabase
  const { data: order, error: orderError } = await getSupabase()
    .from('orders')
    .insert({
      restaurant_id,
      items: orderItems,
      customer_name,
      customer_phone,
      status: 'pending',
      total_price: totalPrice,
      notes: notes ?? null,
    })
    .select()
    .single()

  if (orderError || !order) {
    throw new Error(`주문 생성 실패: ${orderError?.message ?? 'unknown error'}`)
  }

  const createdOrder = order as Order

  // 5. Send notification (fire-and-forget, don't block order creation)
  sendOrderNotification(createdOrder, restaurant as Restaurant).catch((err) => {
    console.error('주문 알림 전송 실패:', err)
  })

  return createdOrder
}

// --- check_order_status ---

interface CheckOrderStatusParams {
  order_id: string
}

interface CheckOrderStatusResult {
  order_id: string
  status: Order['status']
  restaurant_id: string
  total_price: number
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export async function check_order_status(
  params: CheckOrderStatusParams
): Promise<CheckOrderStatusResult> {
  const { order_id } = params

  const { data: order, error } = await getSupabase()
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .single()

  if (error || !order) {
    throw new Error(`주문을 찾을 수 없습니다: ${order_id}`)
  }

  const typedOrder = order as Order

  return {
    order_id: typedOrder.id,
    status: typedOrder.status,
    restaurant_id: typedOrder.restaurant_id,
    total_price: typedOrder.total_price,
    items: typedOrder.items,
    created_at: typedOrder.created_at,
    updated_at: typedOrder.updated_at,
  }
}
