const exec = require("child_process").exec;
exec("npm install", { windowsHide: true }, (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(stdout);
  console.log(stderr);
  exec("npm start", { windowsHide: true });
});
