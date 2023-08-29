module.exports = {
  apps: [
    {
      name: "startscript",
      script: "./startscript.js",
      instances: 1,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
