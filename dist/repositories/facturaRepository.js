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
exports.FacturaRepository = exports.obtenerFacturasDesdeDocumentoXml = void 0;
const nutjs_1 = require("../models/nutjs");
const utils_1 = require("../utils");
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
];
function obtenerFacturasDesdeDocumentoXml() {
    return __awaiter(this, void 0, void 0, function* () {
        const archivoXml = yield (0, utils_1.buscarArchivo)();
        const documento = yield (0, utils_1.leerArchivoXml)(archivoXml);
        const DATOS_POR_FACTURA = 12;
        const POS_PRIMERA_FACTURA = 28;
        const facturas = [];
        let i = POS_PRIMERA_FACTURA;
        while (i < documento.length && documento[i] !== 'Total en Secuencia:') {
            const [establecimiento, puntoEmision] = documento[i]
                .split(' ')
                .map(Number);
            const [day, month, year] = documento[i + 5].split('/');
            const factura = {
                establecimiento,
                puntoEmision,
                secuencia: Number(documento[i + 1]),
                cliente: Number(documento[i + 2]),
                fechaEmision: new Date(`${year}-${month}-${day}T00:00:00`),
                descuento: parseFloat(documento[i + 7].replace(',', '.')),
                total: parseFloat(documento[i + 11].replace(',', '.')),
            };
            facturas.push(factura);
            i += DATOS_POR_FACTURA;
        }
        yield (0, utils_1.eliminarArchivo)(archivoXml);
        return facturas;
    });
}
exports.obtenerFacturasDesdeDocumentoXml = obtenerFacturasDesdeDocumentoXml;
class FacturaRepository {
    constructor(api) {
        this.api = api;
    }
    save(factura) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    search(fechaInicio, fechaFin) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.api.openApp();
            yield this.api.multipleClicks([
                ['ventas', 'ventas-2'],
                'listado-facturas',
            ]);
            yield this.api.obtenerReporte(fechaInicio, fechaFin);
            const facturas = yield obtenerFacturasDesdeDocumentoXml();
            return facturas;
        });
    }
}
exports.FacturaRepository = FacturaRepository;
exports.default = new FacturaRepository(new nutjs_1.WindowsController());
