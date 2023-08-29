module.exports = {
  apps: [
    {
      name: "windows-api",
      script: "./startscript.js",
      instances: 1,
      autorestart: false,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
