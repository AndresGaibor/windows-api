import fs from 'fs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { screen, Region } from '@nut-tree/nut-js'
import path from 'path'
import { directorioRaiz } from '../constants'
import facturaRepository from '../repositories/facturaRepository'

export interface FacturaQuery {
   fechaInicio: string
   fechaFin: string
}
export async function facturaHandler(
   request: FastifyRequest,
   reply: FastifyReply
) {
   try {
      // { fechaInicio: '2021-01-01', fechaFin: '2021-01-31' }
      const { fechaInicio, fechaFin } = request.query as {
         fechaInicio: string | undefined
         fechaFin: string | undefined
      }

      // Crear objetos Date con el mes restado en 1
      let fechaInicioDate: Date | undefined
      let fechaFinDate: Date | undefined

      if (fechaInicio) {
         const [diaInicio, mesInicio, anioInicio] = fechaInicio
            .split('-')
            .map(Number)

         fechaInicioDate = new Date(anioInicio, mesInicio - 1, diaInicio)
      }

      if (fechaFin) {
         const [diaFin, mesFin, anioFin] = fechaFin.split('-').map(Number)

         fechaFinDate = new Date(anioFin, mesFin - 1, diaFin)
      }

      const facturas = await facturaRepository.search(
         fechaInicioDate,
         fechaFinDate
      )

      // retorna facturas como json
      reply.type('application/json').send({ facturas })
   } catch (error: any) {
      reply
         .status(500)
         .send({
            message: 'Error al obtener las facturas',
            error: error.message,
         })
   }
}

export default facturaHandler
