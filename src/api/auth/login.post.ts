import { useValidatedBody } from 'h3-zod'
import { sha256 } from 'ohash'

export default defineEventHandler(async (event) => {
  const { email, password } = await useValidatedBody(
    event,
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  )

  const hasUser = await User.findOne({ email })
  if (!hasUser) {
    return {
      success: false,
      message: 'User not found',
    }
  }

  const currentUser = await User.findOne({
    email,
    password: sha256(password),
  })
  if (!currentUser) {
    return {
      success: false,
      message: 'Invalid password',
    }
  }

  const user = {
    id: `${currentUser._id}`,
    username: currentUser.username,
    email: currentUser.email,
  }

  await setUserSession(event, { user })

  return {
    success: true,
    data: user,
  }
})
