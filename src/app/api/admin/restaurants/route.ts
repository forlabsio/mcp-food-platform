import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ restaurants: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, address, phone, business_hours, category } = body

  if (!name || !address || !phone) {
    return NextResponse.json(
      { error: '식당명, 주소, 전화번호는 필수입니다.' },
      { status: 400 }
    )
  }

  const { data, error } = await getSupabase()
    .from('restaurants')
    .insert({
      name,
      description: description || null,
      address,
      phone,
      business_hours: business_hours || null,
      category: category || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ restaurant: data }, { status: 201 })
}
