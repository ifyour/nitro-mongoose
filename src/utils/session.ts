import type { H3Event } from 'h3'

export interface UserSession {
  user?: {
    id: string
    username: string
    email: string
  }
}

export async function setUserSession(event: H3Event, data: UserSession) {
  const session = await useSessionWarper(event)
  await session.update(data)
  return session.data as UserSession
}

export async function getUserSession(event: H3Event, config?: Partial<SessionConfig>) {
  return (await useSessionWarper(event, config)).data as UserSession
}

export async function clearUserSession(event: H3Event) {
  const session = await useSessionWarper(event, { cookie: false })
  await session.clear()
  return true
}

export async function requireUserSession(event: H3Event) {
  const userSession = await getUserSession(event, { cookie: false })
  if (!userSession.user)
    throw NotAuthenticated('Unauthorized')
  return userSession
}

function useSessionWarper(event: H3Event, config?: Partial<SessionConfig>) {
  const initConfig: SessionConfig = useRuntimeConfig(event).session
  const sessionConfig: SessionConfig = { ...initConfig, maxAge: 60 * 60 * 24, ...config }

  if (!sessionConfig.password) {
    console.warn(
      'No session password set, please set SESSION_PASSWORD in your .env file with at least 32 chars',
    )
  }

  return useSession(event, sessionConfig)
}
