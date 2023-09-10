import type { H3Event } from 'h3'

export interface UserSession {
  user?: {
    id: string;
    username: string;
    email: string;
  }
}

export async function setUserSession (event: H3Event, data: UserSession) {
  const session = await useSessionWarper(event)
  await session.update(data)
  return session.data as UserSession
}

export async function getUserSession (event: H3Event, ignoreCookie?: boolean) {
  return (await useSessionWarper(event, ignoreCookie)).data as UserSession
}

export async function clearUserSession (event: H3Event) {
  const session = await useSessionWarper(event, true)
  await session.clear()
  return true
}

export async function requireUserSession(event: H3Event) {
  const userSession = await getUserSession(event, true)
  if (!userSession.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  return userSession
}

function useSessionWarper (event: H3Event, ignoreCookie = false) {
  let sessionConfig: ArgumentsType<typeof useSession>[1] = useRuntimeConfig(event).session

  if (!sessionConfig.password) {
    console.warn('No session password set, please set SESSION_PASSWORD in your .env file with at least 32 chars')
  }

  if (ignoreCookie) {
    sessionConfig = {...sessionConfig, cookie: false}
  }

  return useSession(event, sessionConfig)
}
