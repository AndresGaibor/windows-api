import {
  mouse,
  left,
  right,
  up,
  down,
  Point,
  straightTo,
  screen,
  imageResource,
  Button,
} from "@nut-tree/nut-js";
import { join } from "path";
import { exec } from "child_process";
require("@nut-tree/template-matcher");
async () => {
  await mouse.move(left(500));
  await mouse.move(up(500));
  await mouse.move(right(500));
  console.log("hola");
  await mouse.move(down(500));

  // const target = new Point(500, 350);
  // await mouse.setPosition(target);
};

// Import the framework and instantiate it
import Fastify from "fastify";

import crypto from "crypto"; // pre-installed node package
require("dotenv").config();

const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "mundo 11" };
});
fastify.post("/git", async function handler(request, reply) {
  const cmd = require("node-cmd");
  const SECRET = process.env.SECRET || "mysecret";

  let hmac = crypto.createHmac("sha1", SECRET);
  let sig = "sha1=" + hmac.update(JSON.stringify(request.body)).digest("hex");
  console.log(
    "UPDATE: ",
    request.headers["x-github-event"],
    sig,
    request.headers["x-hub-signature"]
  );
  // return just status 200
  if (
    request.headers["x-github-event"] == "push" &&
    sig == request.headers["x-hub-signature"]
  ) {
    const path = require("path");

    // Obtener la ruta al directorio padre
    const directorioPadre = path.join(__dirname, "..");

    // Construir la ruta al archivo git.sh en el directorio padre
    const rutaArchivo = path.join(directorioPadre, "git.sh");

    exec(`chmod 777 "${rutaArchivo}"`); /* :/ Fix no perms after updating */
    exec(`bash "${rutaArchivo}"`, (err: any, stdout: any, stderr: any) => {
      // Run our script
      if (stdout) console.log(stdout);
      if (err) console.log(err);
      if (stderr) console.log(stderr);
    });
    // exec("pm2 restart windows-api");
    exec("refresh"); // Refresh project

    console.log("> [GIT] Updated with origin/master");
  }

  reply.code(200).send({ message: "Petición exitosa a /git" });
});

// Run the server!
const app = async () => {
  try {
    await fastify.listen({ port: 3030 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

app();

(async () => {
  try {
    screen.config.resourceDirectory = join(__dirname, "../resources/");
    // const region = await screen.find(imageResource("ventas-menu.png"));
    const region = await screen.find(imageResource("perseo-barra.png"));
    // Region { left: 1, top: 110, width: 102, height: 25 }
    // x 71, y 118

    if (!region) {
      return;
    }

    const point = new Point(
      region.left + region.width / 2,
      region.top + region.height / 2
    );

    mouse.setPosition(point);

    mouse.click(Button.LEFT);

    console.log(region);
  } catch (e) {
    console.error(e);
  }
})();

(async () => {
  try {
    for (let i = 0; i < 10000; i++) {
      const mousePosition = await mouse.getPosition();

      //   console.log(mousePosition);
    }
  } catch (e) {
    console.error(e);
  }
})();
