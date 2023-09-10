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
const crypto_1 = __importDefault(require("crypto"));
const child_process_1 = require("child_process");
const path = require('path');
require('dotenv').config();
const SECRET = process.env.SECRET || 'mysecret';
let hmac = crypto_1.default.createHmac('sha1', SECRET);
const directorioRaiz = path.join(__dirname, '../..');
function setupGitRoutes(app) {
    app.post('/git', (request, reply) => __awaiter(this, void 0, void 0, function* () {
        const { body } = request;
        let sig = 'sha1=' + hmac.update(JSON.stringify(body)).digest('hex');
        if (sig === request.headers['x-hub-signature'] &&
            request.headers['x-github-event'] === 'push') {
            const rutaArchivo = path.join(directorioRaiz, 'git.sh');
            (0, child_process_1.exec)(`chmod 777 "${rutaArchivo}"`);
            (0, child_process_1.exec)(`bash "${rutaArchivo}"`, (err, stdout, stderr) => {
                if (stdout)
                    console.log(stdout);
                if (err)
                    console.log(err);
                if (stderr)
                    console.log(stderr);
            });
            (0, child_process_1.exec)('refresh');
            console.log('> [GIT] Updated with origin/master');
            reply.code(200).send({
                message: 'Petición exitosa a /git',
            });
        }
        else {
            reply.code(401).send({
                message: 'Petición no autorizada ',
            });
        }
    }));
}
exports.default = setupGitRoutes;
