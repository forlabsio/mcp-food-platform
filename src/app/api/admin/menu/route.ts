import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  const restaurantId = request.nextUrl.searchParams.get('restaurant_id')

  let query = getSupabase().from('menu_items').select('*').order('name')

  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId)
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ items: data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { restaurant_id, name, description, price, category } = body

  if (!restaurant_id || !name || price == null) {
    return Response.json(
      { error: 'restaurant_id, name, price는 필수 항목입니다.' },
      { status: 400 }
    )
  }

  const { data, error } = await getSupabase()
    .from('menu_items')
    .insert({
      restaurant_id,
      name,
      description: description ?? null,
      price: Number(price),
      category: category ?? null,
      is_available: true,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ item: data }, { status: 201 })
}
