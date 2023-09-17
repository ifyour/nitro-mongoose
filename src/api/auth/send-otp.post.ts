import { useValidatedBody } from 'h3-zod'
import { sha256 } from 'ohash'

const TWO_HOURS = 2 * 60 * 60 * 1000
export const OTP_LENGTH = 10

export default defineEventHandler(async (event) => {
  const { email } = await useValidatedBody(
    event,
    z.object({ email: z.string().email() }),
  )

  const hasUser = await User.findOne({ email })
  if (!hasUser) {
    return {
      success: false,
      message: 'Mail not found',
    }
  }

  const otp = sha256(`${Date.now()}${Math.random()}`).slice(0, OTP_LENGTH)
  const otpExpiresAt = new Date(Date.now() + TWO_HOURS)

  await User.findOneAndUpdate({ email }, { otp, otpExpiresAt }, { upsert: true })

  // Todo：Send OTP code to email

  return {
    success: true,
    message: 'OTP sent successfully, please check your e-mail.',
  }
})
