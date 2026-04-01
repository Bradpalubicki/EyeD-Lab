'use server'
// src/app/actions/epic.ts
// Server Actions for Epic session management
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function disconnectEpic(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('epic_session')
  redirect('/dashboard')
}
