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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facturaHandler = void 0;
const facturaRepository_1 = __importDefault(require("../repositories/facturaRepository"));
function facturaHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { fechaInicio, fechaFin } = request.query;
            const fechaInicioDate = fechaInicio
                ? new Date(fechaInicio + 'T00:00:00')
                : undefined;
            const fechaFinDate = fechaFin
                ? new Date(fechaFin + 'T00:00:00')
                : undefined;
            const facturas = yield facturaRepository_1.default.search(fechaInicioDate, fechaFinDate);
            reply.type('application/json').send({ facturas });
        }
        catch (error) {
            reply.status(500).send({
                message: 'Error al obtener las facturas',
                error: error.message,
            });
        }
    });
}
exports.facturaHandler = facturaHandler;
exports.default = facturaHandler;
