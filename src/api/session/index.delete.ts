export default eventHandler(async (event) => {
  await clearUserSession(event)
  deleteCookie(event, useRuntimeConfig().session.name)
  return { success: true, message: 'Logged out' }
})
