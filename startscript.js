const exec = require("child_process").exec;

exec(
  "npm install && npm run build && npm start",
  { windowsHide: true },
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(stdout);
    console.log(stderr);
    console.log("Starting server...");
  }
);
