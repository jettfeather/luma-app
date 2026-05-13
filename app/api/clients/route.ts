import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(req: NextRequest) {
  const coachId = new URL(req.url).searchParams.get('coachId')
  if (!coachId) return NextResponse.json([])

  const { data } = await supabase
    .from('users')
    .select('id, name, email, created_at')
    .eq('coach_id', coachId)
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}
