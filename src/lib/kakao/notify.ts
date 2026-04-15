import type { Order, Restaurant } from '@/types/database'

/**
 * Send order notification to the restaurant owner via KakaoTalk Alimtalk.
 *
 * TODO: Integrate with Kakao Alimtalk API
 * - Register Alimtalk template in Kakao Business Channel
 * - Use POST https://kapi.kakao.com/v2/api/talk/memo/default/send
 * - Required: Kakao REST API key, template_id, recipient phone
 */
export async function sendOrderNotification(
  order: Order,
  restaurant: Restaurant
): Promise<{ success: boolean }> {
  const itemsSummary = order.items
    .map((item) => `${item.name} x${item.quantity}`)
    .join(', ')

  const message = [
    `[주문알림] ${restaurant.name}`,
    `주문번호: ${order.id}`,
    `고객: ${order.customer_name}`,
    `메뉴: ${itemsSummary}`,
    `총액: ${order.total_price.toLocaleString()}원`,
  ].join('\n')

  // Prototype: log to console. Replace with actual Kakao Alimtalk API call.
  console.log('--- KakaoTalk Alimtalk Notification ---')
  console.log(message)
  console.log('---------------------------------------')

  return { success: true }
}
