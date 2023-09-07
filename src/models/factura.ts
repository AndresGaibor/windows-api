export interface Factura {
   establecimiento: number
   puntoEmision: number
   secuencia: number
   cliente: number
   fechaEmision: Date
   descuento: number
   total: number
}

// agrega id a la clase Factura
export interface FacturaCreada extends Factura {
   id: number
}

export default Factura
