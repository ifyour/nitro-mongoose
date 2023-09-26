import type { H3Event } from 'h3'

export interface UserSession {
  user?: {
    id: string
    email: string
  }
}

export async function setUserSession(event: H3Event, data: UserSession) {
  const session = await useSessionWarper(event)
  await session.update(data)
  return session.data as UserSession
}

export async function getUserSession(event: H3Event) {
  return (await useSessionWarper(event)).data as UserSession
}

export async function clearUserSession(event: H3Event) {
  const session = await useSessionWarper(event)
  await session.clear()
  return true
}

export async function requireUserSession(event: H3Event) {
  const userSession = await getUserSession(event)
  if (!userSession.user)
    throw NotAuthenticated('Unauthorized')
  return userSession
}

async function useSessionWarper(event: H3Event) {
  const sessionConfig: SessionConfig = useRuntimeConfig(event).session

  if (!sessionConfig.password) {
    console.warn(
      'No session password set, please set SESSION_PASSWORD in your .env file with at least 32 chars',
    )
  }

  return useSession(event, sessionConfig)
}
