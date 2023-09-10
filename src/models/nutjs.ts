import {
   mouse,
   Point,
   screen,
   imageResource,
   Button,
   Region,
   keyboard,
   sleep,
   Key,
} from '@nut-tree/nut-js'
require('@nut-tree/template-matcher')

import { sourcesDirectory } from '../constants'
import { formatString } from '../utils'

const numbers = [
   Key.Num0,
   Key.Num1,
   Key.Num2,
   Key.Num3,
   Key.Num4,
   Key.Num5,
   Key.Num6,
   Key.Num7,
   Key.Num8,
   Key.Num9,
]

type ClickTarget = Point | string | string[]

export class WindowsController {
   constructor() {
      screen.config.resourceDirectory = sourcesDirectory
   }

   async click(target: ClickTarget, delaySeconds = 2) {
      if (typeof target === 'string') {
         target = await this.findImage(target)
      } else if (Array.isArray(target)) {
         target = await this.findImages(target)
      }

      await mouse.setPosition(target)
      await mouse.click(Button.LEFT)
      await sleep(delaySeconds * 1000)
   }

   async safeClick(target: ClickTarget, delaySeconds = 2) {
      try {
         await this.click(target, delaySeconds)
      } catch (error) {}
   }

   async multipleClicks(
      targets: Point[] | string[] | string[][] | (string | string[])[],
      delaySeconds = 2
   ) {
      if (!Array.isArray(targets)) {
         throw new Error('El parámetro targets debe ser un array')
      }

      for (const target of targets) {
         await this.click(target, delaySeconds)
      }
   }

   async type(text: string) {
      keyboard.type(text)
   }

   async findRegion(nombre: string): Promise<Region> {
      try {
         const region = await screen.find(imageResource(nombre + '.png'))

         if (!region) {
            throw new Error('No se encontró el recurso ' + nombre)
         }
         return region
      } catch (error) {
         throw new Error('No se encontró el recurso ' + nombre)
      }
   }

   async findImage(nombre: string): Promise<Point> {
      const region = await this.findRegion(nombre)

      const point = new Point(
         region.left + region.width / 2,
         region.top + region.height / 2
      )

      return point
   }

   async findImages(nombres: string[]): Promise<Point> {
      let i = 0
      let recursoEncontrado: Point | undefined

      try {
         for (const nombre of nombres) {
            i++
            const recurso = await this.findImage(nombre)
            if (recurso) {
               recursoEncontrado = recurso
               break
            }
         }

         if (!recursoEncontrado) {
            throw new Error(
               'No se encontró el recurso findImages ' + nombres[0]
            )
         }

         return recursoEncontrado
      } catch (error) {
         if (nombres.length === 1) {
            throw new Error(
               'No se encontró el recurso findImages ' + nombres[0]
            )
         }
         const r = await this.findImages(nombres.splice(i))
         return r
      }
   }

   async openApp() {
      try {
         await this.findImages(['icono-perseo-barra', 'icono-perseo-barra-2'])

         await this.click(['reportes', 'reportes-2', 'reportes-3'])
         return
      } catch (error) {}

      await this.click('icono-perseo-barra-segundo-plano')
      await sleep(2000)

      await this.click(['reportes', 'reportes-2', 'reportes-3'])
   }

   async ponerFecha(fecha2: Date, recurso: string) {
      const region = await this.findRegion(recurso)

      const point = new Point(
         region.left + region.width,
         region.top + region.height / 2
      )

      await this.click(point)

      const fecha =
         formatString(fecha2.getDate(), 2) +
         formatString(fecha2.getMonth() + 1, 2) +
         fecha2.getFullYear().toString()

      const fechaArray = fecha.split('').map(Number)
      for (let i of fechaArray) {
         await keyboard.pressKey(numbers[i])
      }
   }

   async obtenerReporte(fechaInicio?: Date, fechaFin?: Date) {
      if (fechaInicio) {
         await this.ponerFecha(fechaInicio, 'desde')
      }

      if (fechaFin) {
         await this.ponerFecha(fechaFin, 'hasta')
      }

      await this.click(['visualizar-informe', 'visualizar-informe-2'])
      await this.multipleClicks(['exportar', 'xml', 'guardar'])

      await this.safeClick('si', 3)

      await this.safeClick('no-abrir-documento')

      await this.multipleClicks(['cerrar-reporte', 'cerrar-ventana'])
   }
}
