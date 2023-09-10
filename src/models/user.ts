import { Schema, model } from 'mongoose'

interface IUser {
  username: string
  password: string
  email: string
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
})

export const User = model<IUser>('User', userSchema)
