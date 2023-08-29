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
const path_1 = require("path");
require("@nut-tree/template-matcher");
() => __awaiter(void 0, void 0, void 0, function* () {
    yield nut_js_1.mouse.move((0, nut_js_1.left)(500));
    yield nut_js_1.mouse.move((0, nut_js_1.up)(500));
    yield nut_js_1.mouse.move((0, nut_js_1.right)(500));
    console.log("hola");
    yield nut_js_1.mouse.move((0, nut_js_1.down)(500));
});
const fastify_1 = __importDefault(require("fastify"));
const crypto_1 = __importDefault(require("crypto"));
require("dotenv").config();
const fastify = (0, fastify_1.default)({
    logger: true,
});
fastify.get("/", function handler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        return { hello: "world" };
    });
});
fastify.post("/git", function handler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = require("node-cmd");
        const SECRET = process.env.SECRET || "mysecret";
        let hmac = crypto_1.default.createHmac("sha1", SECRET);
        let sig = "sha1=" + hmac.update(JSON.stringify(request.body)).digest("hex");
        console.log("UPDATE: ", request.headers["x-github-event"], sig, request.headers["x-hub-signature"]);
        if (request.headers["x-github-event"] == "push" &&
            sig == request.headers["x-hub-signature"]) {
            cmd.runSync("chmod 777 ../git.sh");
            cmd.run("../git.sh", (err, data, stderr) => {
                if (data)
                    console.log(data);
                if (err)
                    console.log(err);
            });
            cmd.run("refresh");
            console.log("> [GIT] Updated with origin/master");
        }
        return reply.status(200);
    });
});
const app = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fastify.listen({ port: 3030 });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
app();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        nut_js_1.screen.config.resourceDirectory = (0, path_1.join)(__dirname, "../resources/");
        const region = yield nut_js_1.screen.find((0, nut_js_1.imageResource)("perseo-barra.png"));
        const point = new nut_js_1.Point(region.left + region.width / 2, region.top + region.height / 2);
        nut_js_1.mouse.setPosition(point);
        nut_js_1.mouse.click(nut_js_1.Button.LEFT);
        console.log(region);
    }
    catch (e) {
        console.error(e);
    }
}))();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < 10000; i++) {
            const mousePosition = yield nut_js_1.mouse.getPosition();
            console.log(mousePosition);
        }
    }
    catch (e) {
        console.error(e);
    }
}))();
