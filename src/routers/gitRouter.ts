// gitController.ts

import { FastifyInstance } from 'fastify'
import crypto from 'crypto'
import { exec } from 'child_process'
const path = require('path')
require('dotenv').config()
const SECRET = process.env.SECRET || 'mysecret'
let hmac = crypto.createHmac('sha1', SECRET)

const directorioRaiz = path.join(__dirname, '../..')

function setupGitRoutes(app: FastifyInstance) {
  app.post('/git', async (request, reply) => {
    const { body } = request
    let sig = 'sha1=' + hmac.update(JSON.stringify(body)).digest('hex')
    // const event = headers['x-github-event']
    // const githubSig = headers['x-hub-signature']

    if (
      sig === request.headers['x-hub-signature'] &&
      request.headers['x-github-event'] === 'push'
    ) {
      // Construir la ruta al archivo git.sh en el directorio padre
      const rutaArchivo = path.join(directorioRaiz, 'git.sh')

      exec(`chmod 777 "${rutaArchivo}"`) // Permisos de ejecución
      exec(`bash "${rutaArchivo}"`, (err: any, stdout: any, stderr: any) => {
        // Run our script
        if (stdout) console.log(stdout)
        if (err) console.log(err)
        if (stderr) console.log(stderr)
      })

      exec('refresh') // Refresh project

      console.log('> [GIT] Updated with origin/master')
      reply.code(200).send({
        message: 'Petición exitosa a /git',
      })
    } else {
      reply.code(401).send({
        message: 'Petición no autorizada ',
      })
    }
  })
}

export default setupGitRoutes
