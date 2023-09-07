import { FastifyInstance } from 'fastify'
import facturaHandler from '../controllers/facturaController'

function setupFacturaRoutes(app: FastifyInstance) {
   app.get('/facturas', facturaHandler)
}

export default setupFacturaRoutes
