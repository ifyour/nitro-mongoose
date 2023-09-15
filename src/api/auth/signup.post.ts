import { useValidatedBody } from 'h3-zod'
import { sha256 } from 'ohash'

export default defineEventHandler(async (event) => {
  const { username, password, email } = await useValidatedBody(
    event,
    z.object({
      username: z.string(),
      password: z.string(),
      email: z.string().email(),
    }),
  )

  const users = await User.find()
  if (users.find(user => user.username === username)?.username) {
    return {
      success: false,
      message: 'Username already taken',
    }
  }

  const newUser = await User.create({
    username,
    password: sha256(password),
    email,
  })

  const user = {
    id: `${newUser._id}`,
    username: newUser.username,
    email: newUser.email,
  }

  await setUserSession(event, { user })

  return {
    success: true,
    data: user,
  }
})
