"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const facturaController_1 = __importDefault(require("../controllers/facturaController"));
function setupFacturaRoutes(app) {
    app.get('/facturas', facturaController_1.default);
}
exports.default = setupFacturaRoutes;
