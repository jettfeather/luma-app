import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function getUserProfile(email: string) {
  const { data } = await supabase.from('users').select('id').eq('email', email).single()
  return data
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const table = searchParams.get('table')
  const days = searchParams.get('days')

  if (!email || !table) return NextResponse.json([], { status: 400 })

  const profile = await getUserProfile(email)
  if (!profile) return NextResponse.json([])

  let query = supabase.from(table).select('*').eq('user_id', profile.id)

  if (days) {
    const since = new Date()
    since.setDate(since.getDate() - parseInt(days))
    query = query.gte('date', since.toISOString().split('T')[0])
  }

  if (table === 'journal_entries') {
    query = query.order('created_at', { ascending: false })
  }

  const { data } = await query
  return NextResponse.json(data ?? [])
}

export async function PATCH(req: NextRequest) {
  const { table, id, updates } = await req.json()
  if (!table || !id || !updates) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
