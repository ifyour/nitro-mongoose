import { useValidatedParams } from 'h3-zod'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await useValidatedParams(event, { id: z.string().length(24) })

    const movie = await Movie.findById(id)

    if (!movie) {
      return {
        success: false,
        message: 'Movie not found',
      }
    }

    return {
      success: true,
      data: {
        id: movie._id,
        title: movie.title,
        description: movie.description,
      },
    }
  }
  catch (error) {
    throw createError(error)
  }
})
