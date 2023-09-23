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

  // 检查当前邮箱对应的 OTP 是否有效
  const user = await User.findOne({ email, otp, otpExpiresAt: { $gt: new Date() } })

  if (user) {
    // 验证成功，立即失效 OTP
    await User.findOneAndUpdate({ email }, { otpExpiresAt: new Date() })

    // 更新客户端 cookie 中的 session 信息，标记已登录状态
    await setUserSession(event, { user: { ...user, id: `${user._id}` } })

    // 返回成功信息，页面内跳转到个人中心或者首页
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
