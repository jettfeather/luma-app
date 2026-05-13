import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const { coachEmail, clientEmail } = await req.json()
  if (!coachEmail || !clientEmail) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { data: coach } = await supabase.from('users').select('id').eq('email', coachEmail).single()
  if (!coach) return NextResponse.json({ error: 'Coach not found' }, { status: 404 })

  // Check if invite already exists
  const { data: existing } = await supabase
    .from('invites')
    .select('token')
    .eq('coach_id', coach.id)
    .eq('email', clientEmail)
    .eq('accepted', false)
    .single()

  if (existing) {
    return NextResponse.json({ token: existing.token, alreadyExists: true })
  }

  const { data: invite, error } = await supabase
    .from('invites')
    .insert({ coach_id: coach.id, email: clientEmail })
    .select('token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ token: invite.token })
}

export async function GET(req: NextRequest) {
  const coachEmail = new URL(req.url).searchParams.get('coachEmail')
  if (!coachEmail) return NextResponse.json([])

  const { data: coach } = await supabase.from('users').select('id').eq('email', coachEmail).single()
  if (!coach) return NextResponse.json([])

  const { data } = await supabase
    .from('invites')
    .select('*')
    .eq('coach_id', coach.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}
