export class Establecimiento {
   /**
    *
    * @param codigo Codigo del establecimiento para la secuencia de facturas - ejemplo: 1
    * @param nombre Nombre del establecimiento - ejemplo: Cuenca
    */
   constructor(
      private _id: number,
      private _codigo: number,
      private _nombre: string
   ) {}

   get codigo(): number {
      return this._codigo
   }

   get nombre(): string {
      return this._nombre
   }
}

export class PuntoEmision {
   constructor(
      private _id: number,
      private _codigo: number,
      private _nombre: string,
      private _establecimiento: Establecimiento
   ) {}

   get codigo(): number {
      return this._codigo
   }

   get nombre(): string {
      return this._nombre
   }

   get establecimiento(): Establecimiento {
      return this._establecimiento
   }
}

/**
 *
 * @param text Texto a formatear - ejemplo: 1
 * @param textLength Longitud del texto - ejemplo: 3
 * @param completeWidth Caracter con el que se completara el texto - ejemplo: 0
 * @returns Devuelve el texto formateado - ejemplo: 001
 */
function formatString(
   text: string | number,
   textLength = 3,
   completeWidth: string = '0'
): string {
   const textString = text.toString()

   const textLengthDiff = textLength - textString.length
   if (textLengthDiff > 0) {
      return `${completeWidth.repeat(textLengthDiff)}${textString}`
   }
   return textString
}

export class Secuencial {
   #puntoEmision: PuntoEmision
   #numero: number

   constructor(puntoEmision: PuntoEmision, numero: number) {
      this.#puntoEmision = puntoEmision
      this.#numero = numero
   }

   get puntoEmision(): PuntoEmision {
      return this.#puntoEmision
   }

   get numero(): number {
      return this.#numero
   }

   incrementar(): void {
      this.#numero++
   }

   toPrint(): string {
      const establecimientoCodigo = formatString(
         this.#puntoEmision.establecimiento.codigo,
         3
      )
      const puntoEmisionCodigo = formatString(this.#puntoEmision.codigo, 3)
      const numero = formatString(this.#numero, 9)
      return `${establecimientoCodigo}-${puntoEmisionCodigo}-${numero}`
   }
}
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

class Database {}

export default Factura

const establecimiento = new Establecimiento(1, 1, 'Cuenca')
const puntoEmision = new PuntoEmision(1, 1, 'Principal', establecimiento)
const secuencia = new Secuencial(puntoEmision, 1)
secuencia.incrementar()
secuencia.puntoEmision.establecimiento.nombre

const factura = new Factura(secuencia, 1, new Date())
