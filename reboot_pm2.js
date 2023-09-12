const { execSync, exec, spawn } = require('child_process')
const dotenv = require('dotenv')
dotenv.config()
// PM2_HOME=C:\Users\UserPC\.pm2
// pm2 restart windowsApi
/**
 * [PM2][Initialization] Environment variable HOME (Linux) or HOMEPATH (Windows) are not set!
[PM2][Initialization] Defaulting to /etc/.pm2
unexpected error
Error: connect EPERM //./pipe/interactor.sock
 */
const PM2_HOME = process.env.PM2_HOME

async function reiniciar() {
   console.log('reiniciar')

   try {
      // set HOMEPATH=C:\Users\UserPC\.pm2

      const { stdout, stderr } = execSync(`set HOMEPATH=${PM2_HOME}`)
      console.log('homepath:', stdout)
      if (stderr) console.log('error:', stderr)

      execSync(`pm2 restart windowsApi`, {
         windowsHide: true,
         stdio: 'inherit',
      })
   } catch (error) {
      console.log(error)
   }
}
reiniciar()

// execSync(`pm2 restart windowsApi`, { windowsHide: true, stdio: 'inherit' })
