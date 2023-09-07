import {
   mouse,
   Point,
   screen,
   imageResource,
   Button,
   Region,
   keyboard,
   sleep,
} from '@nut-tree/nut-js'
require('@nut-tree/template-matcher')

import { sourcesDirectory } from '../constants'

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
      try {
         for (const nombre of nombres) {
            const recurso = await this.findImage(nombre)

            return recurso
         }
      } catch (error) {
         return this.findImages(nombres.splice(1))
      } finally {
         throw new Error('No se encontró el recurso ' + nombres[0])
      }
   }

   async openApp() {
      try {
         await this.findImage('icono-perseo-barra')

         return
      } catch (error) {}

      await this.multipleClicks(
         ['icono-perseo-barra-segundo-plano', ['reportes', 'reportes-2']],
         3
      )
   }

   async obtenerReporte(fechaInicio?: Date, fechaFin?: Date) {
      if (fechaInicio) {
         const region = await this.findRegion('desde')

         const point = new Point(
            region.left + region.width,
            region.top + region.height / 2
         )
         await this.click(point)

         await this.type(fechaInicio.getDay().toString())
         await this.type((fechaInicio.getMonth() + 1).toString())
         await this.type(fechaInicio.getFullYear().toString())
      }

      if (fechaFin) {
         const region = await this.findRegion('hasta')

         const point = new Point(
            region.left + region.width,
            region.top + region.height / 2
         )
         await this.click(point)

         await this.type(fechaFin.getDay().toString())
         await this.type((fechaFin.getMonth() + 1).toString())
         await this.type(fechaFin.getFullYear().toString())
      }
      await this.multipleClicks([
         'visualizar-informe',
         'exportar',
         'xml',
         'guardar',
      ])

      await this.safeClick('no-abrir-documento')

      await this.multipleClicks(['cerrar-reporte', 'cerrar-ventana'])
   }
}
