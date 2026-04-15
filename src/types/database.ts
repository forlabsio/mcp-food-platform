export interface Restaurant {
  id: string
  name: string
  description: string | null
  address: string
  phone: string
  business_hours: string | null
  category: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  price: number
  category: string | null
  is_available: boolean
  image_url: string | null
  options: MenuOption[] | null
  created_at: string
}

export interface MenuOption {
  name: string
  choices: { label: string; price_delta: number }[]
}

export interface Order {
  id: string
  restaurant_id: string
  items: OrderItem[]
  customer_name: string
  customer_phone: string
  status: OrderStatus
  total_price: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  menu_item_id: string
  name: string
  quantity: number
  price: number
  options: { name: string; choice: string; price_delta: number }[]
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
