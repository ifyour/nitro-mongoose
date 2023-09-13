export default defineEventHandler(async () => {
  try {
    const movies = await Movie.find()

    return {
      success: true,
      data: movies.map(movie => ({
        id: movie._id,
        title: movie.title,
        description: movie.description,
      })),
    }
  }
  catch (error) {
    throw createError(error)
  }
})
