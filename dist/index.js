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
const nut_js_1 = require("@nut-tree/nut-js");
const path_1 = __importDefault(require("path"));
require('@nut-tree/template-matcher');
const fastify_1 = __importDefault(require("fastify"));
const fs_1 = __importDefault(require("fs"));
const gitRouter_1 = __importDefault(require("./routers/gitRouter"));
const screenshotController_1 = __importDefault(require("./controllers/screenshotController"));
const constants_1 = require("./constants");
const facturaRouter_1 = __importDefault(require("./routers/facturaRouter"));
require('dotenv').config();
let errMessage = '';
const app = (0, fastify_1.default)({ logger: true });
app.get('/', function handler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        return { hello: 'mundo 12' };
    });
});
app.get('/capture', screenshotController_1.default);
app.get('/resources', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const files = fs_1.default.readdirSync(constants_1.sourcesDirectory);
    return files;
}));
app.get('/resources/:name', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = request.params;
    const rutaArchivo = path_1.default.join(constants_1.sourcesDirectory, name);
    const buffer = fs_1.default.readFileSync(rutaArchivo);
    reply.type('image/png').send(buffer);
}));
app.get('/position', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, nut_js_1.sleep)(5000);
    const position = yield nut_js_1.mouse.getPosition();
    return position;
}));
app.post('/click', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = request;
    const points = body;
    for (const point of points) {
        yield nut_js_1.mouse.setPosition(point);
        yield nut_js_1.mouse.click(nut_js_1.Button.LEFT);
        (0, nut_js_1.sleep)(2000);
    }
    return { message: 'Clicks realizados' };
}));
(0, gitRouter_1.default)(app);
(0, facturaRouter_1.default)(app);
app.get('/ventas', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, screenshotController_1.default)(request, reply);
    }
    catch (error) {
        console.error(error);
        reply
            .code(500)
            .send({ message: 'Error al obtener ventas ', error, errMessage });
    }
}));
app.listen({ port: 3030 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log(`Servidor en ejecución en: ${address}`);
});
