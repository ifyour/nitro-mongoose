import { useValidatedBody } from 'h3-zod'
import { sha256 } from 'ohash'

const TWO_HOURS = 2 * 60 * 60 * 1000
export const OTP_LENGTH = 10

export default defineEventHandler(async (event) => {
  const userSession = await requireUserSession(event)

  const { email } = await useValidatedBody(
    event,
    z.object({ email: z.string().email() }),
  )

  if (userSession.user.email !== email) {
    return {
      success: false,
      message: 'Incorrect email address',
    }
  }

  const otp = sha256(`${Date.now()}${Math.random()}`).slice(0, OTP_LENGTH)
  const otpExpiresAt = new Date(Date.now() + TWO_HOURS)

  await User.findOneAndUpdate({ email }, { otp, otpExpiresAt }, { upsert: true })

  // Todo：Send OTP code to email

  return {
    success: true,
    message: 'OTP sent successfully',
    data: otp,
  }
})
