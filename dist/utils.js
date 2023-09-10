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
exports.formatString = exports.leerArchivoXml = exports.eliminarArchivo = exports.buscarArchivo = void 0;
const fs_1 = __importDefault(require("fs"));
const xml2js_1 = __importDefault(require("xml2js"));
const path_1 = require("path");
const constants_1 = require("./constants");
function buscarArchivo(extensionBuscada = '.xml') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const archivos = yield fs_1.default.promises.readdir(constants_1.directorioDescargas);
            let archivoMasReciente = '';
            let fechaMasReciente = new Date(0);
            for (const archivo of archivos) {
                if ((0, path_1.extname)(archivo) !== extensionBuscada) {
                    continue;
                }
                const rutaCompleta = (0, path_1.join)(constants_1.directorioDescargas, archivo);
                const stats = fs_1.default.statSync(rutaCompleta);
                if (archivoMasReciente == '' || stats.mtime > fechaMasReciente) {
                    archivoMasReciente = rutaCompleta;
                    fechaMasReciente = stats.mtime;
                }
            }
            if (archivoMasReciente == '') {
                throw new Error('No se encontró el archivo xml');
            }
            return archivoMasReciente;
        }
        catch (error) {
            throw new Error('No se encontró el archivo xml');
        }
    });
}
exports.buscarArchivo = buscarArchivo;
function eliminarArchivo(archivo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.default.promises.unlink(archivo);
        }
        catch (error) {
            throw new Error('No se pudo eliminar el archivo xml');
        }
    });
}
exports.eliminarArchivo = eliminarArchivo;
function leerArchivoXml(archivo) {
    return __awaiter(this, void 0, void 0, function* () {
        const parser = new xml2js_1.default.Parser({ trim: true, explicitArray: false });
        const xml = yield fs_1.default.promises.readFile(archivo, 'utf8');
        const json = yield parser.parseStringPromise(xml);
        return json.DOCUMENT.TEXT;
    });
}
exports.leerArchivoXml = leerArchivoXml;
function formatString(text, textLength = 3, completeWidth = '0') {
    const textString = text.toString();
    const textLengthDiff = textLength - textString.length;
    if (textLengthDiff > 0) {
        return `${completeWidth.repeat(textLengthDiff)}${textString}`;
    }
    return textString;
}
exports.formatString = formatString;
