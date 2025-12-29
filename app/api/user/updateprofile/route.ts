// app/api/user/updateprofile/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, name, email, gender, phone, birthDate } = body

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // ⭐ UUID로 직접 업데이트
    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        email,
        gender,
        phone: phone.replace(/-/g, ''),
        birth_date: birthDate,
        is_profile_complete: true,
      })
      .eq('id', userId)  // ⭐ UUID 사용
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { error: '프로필 업데이트 실패', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    )
  }
}