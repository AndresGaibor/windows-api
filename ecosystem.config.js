module.exports = {
  apps: [
    {
      name: "windows-api",
      script: "./startscript.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: false,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
