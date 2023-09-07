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
