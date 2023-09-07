import Factura from '../models/factura'
import { WindowsController } from '../models/nutjs'
import { buscarArchivo, eliminarArchivo, leerArchivoXml } from '../utils'

export interface Repository<T> {
   save(factura: T): Promise<void>
   search(fechaInicio?: Date, fechaFin?: Date): Promise<T[]>
}

const p = [
   'Fecha:',
   '07/09/2023 14:32:08',
   'COMERCIAL AGRICOLA GAIBOR APUNTE AGRIGAP S.A.S',
   'SAN MIGUEL',
   '0994284430',
   'RUC',
   '1291786649001',
   'TELEFONOS:',
   'Listado de Facturaci�n General',
   'Desde:',
   '07/09/2023',
   'Hasta:',
   '07/09/2023',
   'REPORTE FILTRADO POR:  Grupo Cliente: Todos, Almacenes: Todos, Secuencias: Todos, Forma de Pago: Todos,Vendedores: Todos, Cliente: Todos, Facturadores: Todos, Centro Costo: Todos, Zonas: Todos, Rutas: Todos, ORDENAR POR : Secuencial',
   'Serie',
   'Secuencia',
   'DNI',
   'Cliente',
   'Forma de Pago',
   'Emisi�n',
   'SubTotal',
   'Descuento',
   'SubT.IVA 0%',
   'SubT.IVA 12%',
   'IVA',
   'TOTAL',
   'Secuencias',
   'Facturas Electr�nicas SM',
   '003 003',
   '000003017',
   '9999999999999',
   'CONSUMIDOR FINAL',
   'EF',
   '07/09/2023',
   '42,50',
   '0,00',
   '9,50',
   '0,00',
   '0,00',
   '42,50',
   '003 003',
   '000003018',
   '9999999999999',
   'CONSUMIDOR FINAL',
   'EF',
   '07/09/2023',
   '5,50',
   '0,00',
   '0,00',
   '0,00',
   '0,00',
   '5,50',
   '003 003',
   '000003019',
   '9999999999999',
   'CONSUMIDOR FINAL',
   'EF',
   '07/09/2023',
   '31,75',
   '0,00',
   '0,00',
   '0,00',
   '0,00',
   '31,75',
   '003 003',
   '000003020',
   '9999999999999',
   'CONSUMIDOR FINAL',
   'EF',
   '07/09/2023',
   '41,00',
   '0,00',
   '0,00',
   '0,00',
   '0,00',
   '41,00',
   'Total en Secuencia:',
   '4',
   '120,75',
   '0,00',
   '9,50',
   '0,00',
   '0,00',
   '120,75',
   'TOTAL DE DOCUMENTOS:',
   '4',
   '120,75',
   '0,00',
   '9,50',
   '0,00',
   '0,00',
   '120,75',
   'FORMA DE PAGO\r\n' +
      '\r\n' +
      'RETENCIONES\r\n' +
      'CREDITO\r\n' +
      'EFECTIVO\r\n' +
      'DEPOSITOS\r\n' +
      'CHEQUES\r\n' +
      'TARJETA\r\n' +
      'PAGO MULTIPLE',
   'TOTALES\r\n\r\n  0,00\r\n  0,00\r\n120,75\r\n  0,00\r\n  0,00\r\n  0,00\r\n0,00',
   'Total Abonos en Facturacion:',
   '0,00',
   'Usuario:',
   'GAIBOR APUNTE ANDRES ALEXANDER',
   'Estacion:',
   'SERVIDOR',
]

export async function obtenerFacturasDesdeDocumentoXml(): Promise<Factura[]> {
   const archivoXml = await buscarArchivo()
   const documento = await leerArchivoXml(archivoXml)

   const DATOS_POR_FACTURA = 12
   const POS_PRIMERA_FACTURA = 28

   const facturas: Factura[] = []

   let i = POS_PRIMERA_FACTURA
   console.log(documento)

   while (i < documento.length && documento[i] !== 'Total en Secuencia:') {
      console.log('serie ', documento[i])

      const [establecimiento, puntoEmision] = documento[i]
         .split(' ')
         .map(Number)
      // fecha de emision es documento[i + 5] y es 31/08/2023
      console.log('fecha ', documento[i + 5])
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
