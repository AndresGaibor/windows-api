module.exports = {
  apps: [
    {
      name: "windows-api",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      post_deploy: "npm install",
    },
  ],
};
