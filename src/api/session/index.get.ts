export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  return { success: true, data: user }
})
