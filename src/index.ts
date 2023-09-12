import {
   mouse,
   Point,
   screen,
   imageResource,
   Button,
   sleep,
} from '@nut-tree/nut-js'
import path from 'path'
require('@nut-tree/template-matcher')

import Fastify from 'fastify'
import fs from 'fs'
import setupGitRoutes from './routers/gitRouter'
import screenshotHandler from './controllers/screenshotController'
import { sourcesDirectory } from './constants'
import setupFacturaRoutes from './routers/facturaRouter'
require('dotenv').config()

let errMessage = ''
const app = Fastify({ logger: true })

app.get('/', async function handler(request, reply) {
   return { hello: 'mundo 28' }
})

app.get('/capture', screenshotHandler)

app.get('/resources', async (request, reply) => {
   const files = fs.readdirSync(sourcesDirectory)
   return files
})
app.get('/resources/:name', async (request, reply) => {
   const { name } = request.params as { name: string }
   const rutaArchivo = path.join(sourcesDirectory, name)
   const buffer = fs.readFileSync(rutaArchivo)
   reply.type('image/png').send(buffer)
})

app.get('/position', async (request, reply) => {
   await sleep(5000)
   const position = await mouse.getPosition()
   return position
})

app.post('/click', async (request, reply) => {
   const { body } = request
   const points = body as Point[]

   for (const point of points) {
      await mouse.setPosition(point)
      await mouse.click(Button.LEFT)
      sleep(2000)
   }
   return { message: 'Clicks realizados' }
})

setupGitRoutes(app)
setupFacturaRoutes(app)

app.get('/ventas', async (request, reply) => {
   try {
      await screenshotHandler(request, reply)
   } catch (error) {
      console.error(error)
      reply
         .code(500)
         .send({ message: 'Error al obtener ventas ', error, errMessage })
   }
})

app.listen({ port: 3030 }, (err, address) => {
   if (err) {
      app.log.error(err)
      process.exit(1)
   }
   console.log(`Servidor en ejecución en: ${address}`)
})
