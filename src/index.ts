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
  keyboard,
  sleep,
  Key,
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
import screenshotHandler from './controllers/screenshotController'
require('dotenv').config()

let errMessage = ''
const app = Fastify({ logger: true })

// Declare a route
app.get('/', async function handler(request, reply) {
  return { hello: 'mundo 12' }
})
export const directorioRaiz = path.join(__dirname, '../')
export const sourcesDirectory = path.join(directorioRaiz, 'resources')
screen.config.resourceDirectory = sourcesDirectory

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

app.get('/ventas', async (request, reply) => {
  try {
    await abrirPerseo()
    await sleep(2000)
    const ventas = await buscarRecursos(['ventas-menu', 'ventas-menu-icono'])
    if (!ventas) {
      return reply
        .code(500)
        .send({ message: 'No se encontró el recurso ventas' })
    }
    mouse.setPosition(ventas)
    mouse.click(Button.LEFT)

    await sleep(2000)

    const facturacion = await buscarRecursos([
      'facturacion',
      'facturacion-2',
      'facturacion-3',
      'facturacion-4',
      'facturacion-icono',
    ])
    if (!facturacion) {
      return reply
        .code(500)
        .send({ message: 'No se encontró el recurso facturacion' })
    }
    mouse.setPosition(facturacion)
    mouse.click(Button.LEFT)

    await sleep(2000)

    const resumen = await buscarRecursos(['resumen', 'resumen-2', 'resumen-3'])
    if (!resumen) {
      return reply
        .code(500)
        .send({ message: 'No se encontró el recurso resumen' })
    }

    mouse.setPosition(resumen)
    mouse.click(Button.LEFT)

    await sleep(2000)

    const textoDesde = await buscarRecursos(['fecha-desde', 'fecha-desde-2'])
    const textoHasta = await buscarRecursos(['fecha-hasta', 'fecha-hasta-2'])
    if (!textoDesde || !textoHasta) {
      return reply
        .code(500)
        .send({ message: 'No se encontró el recurso desde o hasta' })
    }

    const desde = new Point(textoDesde.x + 100, textoDesde.y)
    const hasta = new Point(textoHasta.x + 100, textoHasta.y)

    mouse.setPosition(desde)
    mouse.click(Button.LEFT)

    keyboard.config.autoDelayMs = 1000
    keyboard.type('28082023')

    await sleep(2000)

    mouse.setPosition(hasta)
    mouse.click(Button.LEFT)

    keyboard.type('28082023')

    const buscar = await buscarRecursos(['btn-consultar', 'btn-consultar-2'])
    if (!buscar) {
      return reply
        .code(500)
        .send({ message: 'No se encontró el recurso btn-consultar' })
    }

    mouse.setPosition(buscar)
    mouse.click(Button.LEFT)

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

async function buscarRecurso(nombre: string): Promise<Point | null> {
  try {
    const region = await screen.find(imageResource(nombre + '.png'))

    if (!region) {
      return null
    }
    const point = new Point(
      region.left + region.width / 2,
      region.top + region.height / 2
    )

    return point
  } catch (error: any) {
    console.error(error)
    errMessage = error.message as string
    return null
  }
}
async function buscarRecursos(nombres: string[]): Promise<Point | null> {
  for (const nombre of nombres) {
    console.log('Buscando recurso: ', nombre)
    const recurso = await buscarRecurso(nombre)

    if (recurso) {
      return recurso
    }
  }

  return null
}

async function abrirPerseo(): Promise<boolean> {
  try {
    screen.config.resourceDirectory = sourcesDirectory
    // const region = await screen.find(imageResource("ventas-menu.png"));
    const perseoAbierto = await buscarRecurso('perseo-barra-abierto')
    // x 71, y 118

    if (perseoAbierto) {
      return true
    }

    const perseo = await buscarRecurso('perseo-barra-segundo-plano')
    if (!perseo) {
      return false
    }

    mouse.setPosition(perseo)

    mouse.click(Button.LEFT)

    mouse.setPosition(perseo)

    mouse.click(Button.LEFT)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

;(async () => {
  try {
    // const region = await screen.find(imageResource("ventas-menu.png"));
    // await abrirPerseo()
    // const ventas = await buscarRecurso('ventas-menu')
    // if (ventas) {
    //   mouse.setPosition(ventas)
    //   mouse.click(Button.LEFT)
    // }
  } catch (e) {
    console.error(e)
  }
})()
