import fs from 'fs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { screen, Region } from '@nut-tree/nut-js'
import path from 'path'
import { directorioRaiz } from '../constants'
import facturaRepository from '../repositories/facturaRepository'

export interface FacturaQuery {
   fechaInicio: string | undefined
   fechaFin: string | undefined
}
export async function facturaHandler(
   request: FastifyRequest,
   reply: FastifyReply
) {
   try {
      // { fechaInicio: '2021-01-01', fechaFin: '2021-01-31' }
      const { fechaInicio, fechaFin } = request.query as FacturaQuery

      const fechaInicioDate = fechaInicio
         ? new Date(fechaInicio + 'T00:00:00')
         : undefined

      const fechaFinDate = fechaFin
         ? new Date(fechaFin + 'T00:00:00')
         : undefined

      const facturas = await facturaRepository.search(
         fechaInicioDate,
         fechaFinDate
      )

      // retorna facturas como json
      reply.type('application/json').send({ facturas })
   } catch (error: any) {
      reply.status(500).send({
         message: 'Error al obtener las facturas',
         error: error.message,
      })
   }
}

export default facturaHandler
