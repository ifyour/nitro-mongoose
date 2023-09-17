import { Schema, model } from 'mongoose'

interface IUser {
  username: string
  password: string
  email: string
  isMailVerified?: boolean
  otp?: string
  otpExpiresAt?: Date
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  isMailVerified: { type: Boolean, required: false },
  otp: { type: String, required: false },
  otpExpiresAt: { type: Date, required: false },
})

export const User = model<IUser>('User', userSchema)
