import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const { userId, coachEmail } = await req.json()
  if (!userId || !coachEmail) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { data: coach } = await supabase
    .from('users')
    .select('id, role')
    .eq('email', coachEmail)
    .single()

  if (!coach) return NextResponse.json({ error: 'No Luma account found for that email.' }, { status: 404 })
  if (coach.role !== 'coach') return NextResponse.json({ error: 'That account is not a coach.' }, { status: 400 })

  const { error } = await supabase.from('users').update({ coach_id: coach.id }).eq('id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
