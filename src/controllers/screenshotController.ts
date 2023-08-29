import fs from 'fs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { screen, Region } from '@nut-tree/nut-js'
import path from 'path'
import { directorioRaiz } from '..'

export async function screenshotHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // return a screenshot
  const width = await screen.width()
  const height = await screen.height()

  const halfWidth = width / 2

  await screen.highlight(new Region(halfWidth, 0, halfWidth, height))
  await screen.capture('screenshot.png')
  const rutaArchivo = path.join(directorioRaiz, 'screenshot.png')
  // return schreenshot.png
  const bufferIndexHtml = fs.readFileSync(rutaArchivo)
  // delete file
  fs.unlinkSync(rutaArchivo)
  reply.type('image/png').send(bufferIndexHtml)
}

export default screenshotHandler
