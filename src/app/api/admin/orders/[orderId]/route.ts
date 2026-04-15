import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'
import type { OrderStatus } from '@/types/database'

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled',
]

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params
  const body = await request.json()
  const { status } = body as { status: OrderStatus }

  if (!status || !VALID_STATUSES.includes(status)) {
    return Response.json(
      {
        error: `유효하지 않은 상태입니다. 허용: ${VALID_STATUSES.join(', ')}`,
      },
      { status: 400 }
    )
  }

  const { data, error } = await getSupabase()
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return Response.json(
      { error: '주문을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  return Response.json({ order: data })
}
