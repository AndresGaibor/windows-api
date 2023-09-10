module.exports = {
   apps: [
      {
         name: 'windowsApi',
         script: 'npm',
         args: 'run start',
         instances: 1,
         watch: false,
         autorestart: true,
         max_memory_restart: '1G',
         env: {
            NODE_ENV: 'production',
         },
      },
   ],
}
