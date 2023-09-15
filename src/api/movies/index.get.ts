export default defineEventHandler(async () => {
  const movies = await Movie.find()

  return {
    success: true,
    data: movies.map(movie => ({
      id: movie._id,
      title: movie.title,
      description: movie.description,
    })),
  }
})
