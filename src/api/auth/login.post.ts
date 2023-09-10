import { useValidatedBody } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const { username, password } = await useValidatedBody(event, z.object({
    username: z.string(),
    password: z.string(),
  }))

  const hasUser = await User.findOne({ username })
  if (!hasUser) {
    return {
      success: false,
      message: 'User not found'
    }
  }

  const currentUser = await User.findOne({ username, password })
  if (!currentUser) {
    return {
      success: false,
      message: 'Invalid password'
    }
  }

  try {
    const user = {
      id: `${currentUser._id}`,
      username: currentUser.username,
      email: currentUser.email,
    }

    await setUserSession(event, { user })

    return {
      success: true,
      data: user
    }
  } catch {
    throw InternalError('Something went wrong')
  }
})
