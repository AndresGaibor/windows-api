const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function run() {
  try {
    console.log("Installing dependencies...");
    const installResult = await exec("npm install");
    console.log(installResult.stdout);
    console.log(installResult.stderr);

    console.log("Starting server...");
    const startResult = await exec("npm start");
    console.log(startResult.stdout);
    console.log(startResult.stderr);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
