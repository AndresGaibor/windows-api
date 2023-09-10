"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourcesDirectory = exports.directorioRaiz = exports.directorioDescargas = void 0;
const path_1 = require("path");
exports.directorioDescargas = 'C:/Users/UserPC/Downloads';
exports.directorioRaiz = (0, path_1.join)(__dirname, '../');
exports.sourcesDirectory = (0, path_1.join)(exports.directorioRaiz, 'resources');
