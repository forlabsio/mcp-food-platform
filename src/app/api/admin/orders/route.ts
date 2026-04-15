import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ orders: data })
}
