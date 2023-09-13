export default eventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    return {
      success: true,
      data: user,
    }
  }
  catch (error) {
    throw createError(error)
  }
})
