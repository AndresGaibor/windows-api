import {
  mouse,
  left,
  right,
  up,
  down,
  Point,
  straightTo,
  screen,
  imageResource,
  Button,
  Region,
  pixelWithColor,
  RGBA,
} from '@nut-tree/nut-js'
import path, { join } from 'path'
import { exec } from 'child_process'
require('@nut-tree/template-matcher')
;async () => {
  await mouse.move(left(500))
  await mouse.move(up(500))
  await mouse.move(right(500))
  console.log('hola')
  await mouse.move(down(500))

  // const target = new Point(500, 350);
  // await mouse.setPosition(target);
}

// Import the framework and instantiate it
import Fastify from 'fastify'
import fs from 'fs'
import crypto from 'crypto' // pre-installed node package
import setupGitRoutes from './routers/gitRouter'
require('dotenv').config()

const app = Fastify({ logger: true })

// Declare a route
app.get('/', async function handler(request, reply) {
  return { hello: 'mundo 11' }
})

app.get('/capture', async function handler(request, reply) {
  // return a screenshot
  const width = await screen.width()
  const height = await screen.height()

  const halfWidth = width / 2

  await screen.highlight(new Region(halfWidth, 0, halfWidth, height))
  await screen.capture('screenshot.png')
  const directorioRaiz = path.join(__dirname, '../')
  const rutaArchivo = path.join(directorioRaiz, 'screenshot.png')
  // return schreenshot.png
  const bufferIndexHtml = fs.readFileSync(rutaArchivo)
  reply.type('image/png').send(bufferIndexHtml)
})
setupGitRoutes(app)

app.listen({ port: 3030 }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`Servidor en ejecución en: ${address}`)
})
;(async () => {
  try {
    screen.config.resourceDirectory = join(__dirname, '../resources/')
    // const region = await screen.find(imageResource("ventas-menu.png"));
    const region = await screen.find(imageResource('perseo-barra.png'))
    // Region { left: 1, top: 110, width: 102, height: 25 }
    // x 71, y 118

    if (!region) {
      return
    }

    const point = new Point(
      region.left + region.width / 2,
      region.top + region.height / 2
    )

    mouse.setPosition(point)

    mouse.click(Button.LEFT)

    console.log(region)
  } catch (e) {
    console.error(e)
  }
})()
;(async () => {
  try {
    for (let i = 0; i < 10000; i++) {
      const mousePosition = await mouse.getPosition()

      //   console.log(mousePosition);
    }
  } catch (e) {
    console.error(e)
  }
})()
