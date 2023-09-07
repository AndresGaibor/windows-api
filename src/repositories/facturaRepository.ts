import Factura from '../models/factura'
import { WindowsController } from '../models/nutjs'
import { buscarArchivo, eliminarArchivo, leerArchivoXml } from '../utils'

export interface Repository<T> {
   save(factura: T): Promise<void>
   search(fechaInicio?: Date, fechaFin?: Date): Promise<T[]>
}

export async function obtenerFacturasDesdeDocumentoXml(): Promise<Factura[]> {
   const archivoXml = await buscarArchivo()
   const documento = await leerArchivoXml(archivoXml)

   const DATOS_POR_FACTURA = 12
   const POS_PRIMERA_FACTURA = 29

   const facturas: Factura[] = []

   let i = POS_PRIMERA_FACTURA

   while (i < documento.length || documento[i] !== 'Total en Secuencia:') {
      const [establecimiento, puntoEmision] = documento[i]
         .split(' ')
         .map(Number)
      // fecha de emision es documento[i + 5] y es 31/08/2023
      const [day, month, year] = documento[i + 5].split('/').map(Number)

      const factura: Factura = {
         establecimiento,
         puntoEmision,
         secuencia: Number(documento[i + 1]),
         cliente: Number(documento[i + 2]),
         fechaEmision: new Date(year, month - 1, day),
         descuento: Number(documento[i + 7]),
         total: Number(documento[i + 11]),
      }

      facturas.push(factura)

      i += DATOS_POR_FACTURA
   }

   await eliminarArchivo(archivoXml)

   return facturas
}

export class FacturaRepository implements Repository<Factura> {
   constructor(private api: WindowsController) {}
   async save(factura: Factura) {}

   async search(fechaInicio?: Date, fechaFin?: Date): Promise<Factura[]> {
      await this.api.openApp()

      await this.api.multipleClicks([
         ['ventas', 'ventas-2'],
         'listado-facturas',
      ])

      await this.api.obtenerReporte(fechaInicio, fechaFin)

      const facturas = await obtenerFacturasDesdeDocumentoXml()

      return facturas
   }
}

export default new FacturaRepository(new WindowsController())
