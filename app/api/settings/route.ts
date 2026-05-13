import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(req: NextRequest) {
  const email = new URL(req.url).searchParams.get('email')
  if (!email) return NextResponse.json(null)
  const { data } = await supabase
    .from('users')
    .select('id, role, name, email, coach_id, bot_morning_time, bot_evening_time, bot_tone, bot_areas')
    .eq('email', email)
    .single()
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const { error } = await supabase.from('users').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
