import { useValidatedParams } from 'h3-zod'

export default defineEventHandler(async (event) => {

  await requireUserSession(event)

  const { id } = await useValidatedParams(event, { id: z.string().length(24) })

  const movie = await Movie.findById({ _id: id })

  if (!movie) {
    return { success: false, message: 'Movie not found' }
  }

  const response = await Movie.deleteOne({ _id: id })

  if (response.deletedCount === 1) {
    return { success: true, message: 'Movie deleted' }
  }

  return { success: false, message: 'unknown' }

})
