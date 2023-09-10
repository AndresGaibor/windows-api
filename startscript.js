const util = require('util')
const { execSync } = require('child_process')
const exec = util.promisify(require('child_process').exec)

// first two args can be ignored rest will be passed directly to the npm command
const [ingore, ignore2, ...args] = process.argv

// windowsHide option will hide the cmd window
execSync(`npm ${args.join(' ')}`, { windowsHide: true, stdio: 'inherit' })
// pm2 start startscript.js --name windowsApi -- start

// async function run() {
//   try {
//     console.log("Installing dependencies...");
//     const installResult = await exec("npm install");
//     console.log(installResult.stdout);
//     console.log(installResult.stderr);

//     console.log("Starting server...");
//     const startResult = await exec("npm start");
//     console.log(startResult.stdout);
//     console.log(startResult.stderr);
//   } catch (err) {
//     console.error("Error:", err);
//   }
// }

// run();
