import { useValidatedBody } from 'h3-zod'
import { sha256 } from 'ohash'

export default defineEventHandler(async (event) => {
  const { password, email } = await useValidatedBody(
    event,
    z.object({
      password: z.string(),
      email: z.string().email(),
    }),
  )

  const users = await User.find()
  if (users.find(user => user.email === email)?.email) {
    return {
      success: false,
      message: 'Email Already Registered',
    }
  }

  const newUser = await User.create({ email, password: sha256(password) })

  const user = { id: `${newUser._id}`, email: newUser.email }

  await setUserSession(event, { user })

  return {
    success: true,
    data: user,
  }
})
