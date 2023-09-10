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
exports.screenshotHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const nut_js_1 = require("@nut-tree/nut-js");
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
function screenshotHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const width = yield nut_js_1.screen.width();
        const height = yield nut_js_1.screen.height();
        const halfWidth = width / 2;
        yield nut_js_1.screen.highlight(new nut_js_1.Region(halfWidth, 0, halfWidth, height));
        yield nut_js_1.screen.capture('screenshot.png');
        const rutaArchivo = path_1.default.join(constants_1.directorioRaiz, 'screenshot.png');
        const bufferIndexHtml = fs_1.default.readFileSync(rutaArchivo);
        fs_1.default.unlinkSync(rutaArchivo);
        reply.type('image/png').send(bufferIndexHtml);
    });
}
exports.screenshotHandler = screenshotHandler;
exports.default = screenshotHandler;
