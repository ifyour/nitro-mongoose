export default eventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event)
    if (user) {
      await clearUserSession(event)
      deleteCookie(event, useRuntimeConfig().session.name)
      return { success: true, message: 'Logged out' }
    }
    return { success: false, message: 'Currently not logged in' }
  }
  catch (error) {
    throw createError(error)
  }
})
