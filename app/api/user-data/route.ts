import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function resolveUserId(userId?: string | null, email?: string | null): Promise<string | null> {
  if (userId) return userId
  if (!email) return null
  const { data } = await supabase.from('users').select('id').eq('email', email).single()
  return data?.id ?? null
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const email = searchParams.get('email')
  const table = searchParams.get('table')
  const days = searchParams.get('days')

  if (!table) return NextResponse.json([], { status: 400 })

  const resolvedId = await resolveUserId(userId, email)
  if (!resolvedId) return NextResponse.json([])

  let query = supabase.from(table).select('*').eq('user_id', resolvedId)

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

export async function POST(req: NextRequest) {
  const { table, record, records } = await req.json()
  if (!table || (!record && !records)) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const payload = records ?? record
  const { data, error } = await supabase.from(table).insert(payload).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const { table, id, updates } = await req.json()
  if (!table || !id || !updates) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const { table, id } = await req.json()
  if (!table || !id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
