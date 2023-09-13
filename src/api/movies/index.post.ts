import { useValidatedBody } from 'h3-zod'

export default defineEventHandler(async (event) => {
  try {
    const { title, description } = await useValidatedBody(
      event,
      z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    )

    const newMovie = await Movie.create({ title, description })

    return {
      success: true,
      data: {
        id: newMovie._id,
        title: newMovie.title,
        description: newMovie.description,
      },
    }
  }
  catch (error) {
    throw createError(error)
  }
})
