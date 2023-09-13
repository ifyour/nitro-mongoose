import type { NitroErrorHandler } from 'nitropack'

export default <NitroErrorHandler>function (error, event) {
  const { statusCode, statusMessage, message, data } = error
  const { res } = event.node

  const response = {
    success: false,
    message: message || (data?.name === 'ZodError' ? 'Invalid params' : statusMessage),
    code: statusCode,
    data: data?.issues,
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(response))
}
