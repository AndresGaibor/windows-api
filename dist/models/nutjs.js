"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowsController = void 0;
const nut_js_1 = require("@nut-tree/nut-js");
require('@nut-tree/template-matcher');
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const numbers = [
    nut_js_1.Key.Num0,
    nut_js_1.Key.Num1,
    nut_js_1.Key.Num2,
    nut_js_1.Key.Num3,
    nut_js_1.Key.Num4,
    nut_js_1.Key.Num5,
    nut_js_1.Key.Num6,
    nut_js_1.Key.Num7,
    nut_js_1.Key.Num8,
    nut_js_1.Key.Num9,
];
class WindowsController {
    constructor() {
        nut_js_1.screen.config.resourceDirectory = constants_1.sourcesDirectory;
    }
    click(target, delaySeconds = 2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof target === 'string') {
                target = yield this.findImage(target);
            }
            else if (Array.isArray(target)) {
                target = yield this.findImages(target);
            }
            yield nut_js_1.mouse.setPosition(target);
            yield nut_js_1.mouse.click(nut_js_1.Button.LEFT);
            yield (0, nut_js_1.sleep)(delaySeconds * 1000);
        });
    }
    safeClick(target, delaySeconds = 2) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.click(target, delaySeconds);
            }
            catch (error) { }
        });
    }
    multipleClicks(targets, delaySeconds = 2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(targets)) {
                throw new Error('El parámetro targets debe ser un array');
            }
            for (const target of targets) {
                yield this.click(target, delaySeconds);
            }
        });
    }
    type(text) {
        return __awaiter(this, void 0, void 0, function* () {
            nut_js_1.keyboard.type(text);
        });
    }
    findRegion(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const region = yield nut_js_1.screen.find((0, nut_js_1.imageResource)(nombre + '.png'));
                if (!region) {
                    throw new Error('No se encontró el recurso ' + nombre);
                }
                return region;
            }
            catch (error) {
                throw new Error('No se encontró el recurso ' + nombre);
            }
        });
    }
    findImage(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            const region = yield this.findRegion(nombre);
            const point = new nut_js_1.Point(region.left + region.width / 2, region.top + region.height / 2);
            return point;
        });
    }
    findImages(nombres) {
        return __awaiter(this, void 0, void 0, function* () {
            let i = 0;
            let recursoEncontrado;
            try {
                for (const nombre of nombres) {
                    i++;
                    const recurso = yield this.findImage(nombre);
                    if (recurso) {
                        recursoEncontrado = recurso;
                        break;
                    }
                }
                if (!recursoEncontrado) {
                    throw new Error('No se encontró el recurso findImages ' + nombres[0]);
                }
                return recursoEncontrado;
            }
            catch (error) {
                if (nombres.length === 1) {
                    throw new Error('No se encontró el recurso findImages ' + nombres[0]);
                }
                const r = yield this.findImages(nombres.splice(i));
                return r;
            }
        });
    }
    openApp() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.findImages(['icono-perseo-barra', 'icono-perseo-barra-2']);
                yield this.click(['reportes', 'reportes-2', 'reportes-3']);
                return;
            }
            catch (error) { }
            yield this.click('icono-perseo-barra-segundo-plano');
            yield (0, nut_js_1.sleep)(2000);
            yield this.click(['reportes', 'reportes-2', 'reportes-3']);
        });
    }
    ponerFecha(fecha2, recurso) {
        return __awaiter(this, void 0, void 0, function* () {
            const region = yield this.findRegion(recurso);
            const point = new nut_js_1.Point(region.left + region.width, region.top + region.height / 2);
            yield this.click(point);
            const fecha = (0, utils_1.formatString)(fecha2.getDate(), 2) +
                (0, utils_1.formatString)(fecha2.getMonth() + 1, 2) +
                fecha2.getFullYear().toString();
            const fechaArray = fecha.split('').map(Number);
            for (let i of fechaArray) {
                yield nut_js_1.keyboard.pressKey(numbers[i]);
            }
        });
    }
    obtenerReporte(fechaInicio, fechaFin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fechaInicio) {
                yield this.ponerFecha(fechaInicio, 'desde');
            }
            if (fechaFin) {
                yield this.ponerFecha(fechaFin, 'hasta');
            }
            yield this.click(['visualizar-informe', 'visualizar-informe-2']);
            yield this.multipleClicks(['exportar', 'xml', 'guardar']);
            yield this.safeClick('si', 3);
            yield this.safeClick('no-abrir-documento');
            yield this.multipleClicks(['cerrar-reporte', 'cerrar-ventana']);
        });
    }
}
exports.WindowsController = WindowsController;
