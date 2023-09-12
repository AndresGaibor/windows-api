import { execSync } from 'child_process'

// pm2 restart windowsApi

execSync(`pm2 restart windowsApi`, { windowsHide: true, stdio: 'inherit' })
