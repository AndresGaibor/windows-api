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
const feathers_1 = require("@feathersjs/feathers");
const koa_1 = require("@feathersjs/koa");
const socketio_1 = __importDefault(require("@feathersjs/socketio"));
class MessageService {
    constructor() {
        this.messages = [];
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messages;
        });
    }
    get(id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = this.messages.find((message) => message.id === id);
            if (!message) {
                throw new Error(`Message with id ${id} not found`);
            }
            return message;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = {
                id: this.messages.length,
                text: data.text,
            };
            this.messages.push(message);
            return message;
        });
    }
}
class UpdateService {
    update() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
const app = (0, koa_1.koa)((0, feathers_1.feathers)());
app.use((0, koa_1.serveStatic)("."));
app.use((0, koa_1.errorHandler)());
app.use((0, koa_1.bodyParser)());
app.configure((0, koa_1.rest)());
app.configure((0, socketio_1.default)());
app.use("messages", new MessageService());
app.on("connection", (connection) => app.channel("everybody").join(connection));
app.publish((_data) => app.channel("everybody"));
app
    .listen(3030)
    .then(() => console.log("Feathers server listening on localhost:3030"));
app.service("messages").create({
    text: "Hello world from the server",
});
app.service("messages").on("created", (message) => {
    console.log("A new message has been created", message);
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield app.service("messages").create({
        text: "Hello Feathers",
    });
    yield app.service("messages").create({
        text: "Hello again",
    });
    const messages = yield app.service("messages").find();
    console.log("All messages", messages);
});
main();
