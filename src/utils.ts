import fs from 'fs'
import xml2js from 'xml2js'
import { extname, join } from 'path'
import { directorioDescargas } from './constants'

export async function buscarArchivo(extensionBuscada: string = '.xml') {
   try {
      const archivos = await fs.promises.readdir(directorioDescargas)

      let archivoMasReciente = ''
      let fechaMasReciente: Date = new Date(0)

      for (const archivo of archivos) {
         if (extname(archivo) !== extensionBuscada) {
            continue
         }

         const rutaCompleta = join(directorioDescargas, archivo)
         const stats = fs.statSync(rutaCompleta)

         if (archivoMasReciente == '' || stats.mtime > fechaMasReciente) {
            archivoMasReciente = rutaCompleta
            fechaMasReciente = stats.mtime
         }
      }

      if (archivoMasReciente == '') {
         throw new Error('No se encontró el archivo xml')
      }

      return archivoMasReciente
   } catch (error) {
      throw new Error('No se encontró el archivo xml')
   }
}

export async function eliminarArchivo(archivo: string) {
   try {
      await fs.promises.unlink(archivo)
   } catch (error) {
      throw new Error('No se pudo eliminar el archivo xml')
   }
}

export async function leerArchivoXml(archivo: string) {
   const parser = new xml2js.Parser({ trim: true, explicitArray: false })

   const xml = await fs.promises.readFile(archivo, 'utf8')

   const json = await parser.parseStringPromise(xml)

   return json.DOCUMENT.TEXT as string[]
}
