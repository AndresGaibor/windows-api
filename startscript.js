const exec = require("child_process").exec;

exec("npm install", { windowsHide: false }, (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(stdout);
  console.log(stderr);
  console.log("Starting server...");
  exec("npm start", { windowsHide: false });
});
