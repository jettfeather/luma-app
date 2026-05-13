import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(req: NextRequest) {
  const email = new URL(req.url).searchParams.get('email')
  if (!email) return NextResponse.json(null)
  const { data } = await supabase.from('users').select('role').eq('email', email).single()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { id, email, role, inviteToken } = await req.json()
  if (!id || !email || !role) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  let coachId: string | null = null

  // If they signed up via an invite link, link them to the coach
  if (inviteToken) {
    const { data: invite } = await supabase
      .from('invites')
      .select('coach_id, accepted')
      .eq('token', inviteToken)
      .eq('accepted', false)
      .single()

    if (invite) {
      coachId = invite.coach_id
      await supabase.from('invites').update({ accepted: true }).eq('token', inviteToken)
    }
  }

  const { error } = await supabase.from('users').upsert(
    {
      id,
      email,
      role,
      ...(coachId ? { coach_id: coachId } : {}),
    },
    { onConflict: 'email' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
