import { useValidatedBody } from 'h3-zod'
import { OTP_LENGTH } from './send-otp.post'

export default defineEventHandler(async (event) => {
  const { email, otp } = await useValidatedBody(
    event,
    z.object({
      email: z.string().email(),
      otp: z.string().length(OTP_LENGTH),
    }),
  )

  // Check if TOP is valid，current time is less than expiration time
  const user = await User.findOne({ email, otp, otpExpiresAt: { $gt: new Date() } })

  if (user) {
    await User.findOneAndUpdate({ email }, { otpExpiresAt: new Date(), otp: '' })
    return {
      success: true,
      message: 'OTP verification successful',
    }
  }

  return {
    success: false,
    message: 'Invalid OTP',
  }
})
