# freeso-dashboard-api
The backend for [FreeSO Dashboard](https://dashboard.thecode.house).

## Quick Start Development Guide
1. `git clone https://github.com/dotequals/freeso-dashboard-api.git`
2. Install and start the server
  1. `cd freeso-dashboard-api && npm install` 
  2. `npm start`

## Putting Into Production
These instructions are opinionated and assume Ubuntu 16.04.

1. `sudo npm install --global pm2`
2. `git clone https://github.com/dotequals/freeso-dashboard-api.git`
3. `cd freeso-dashboard-api && npm install` 
6. `pm2 start index.js --name freeso-dashboard-api`
  - We are using `pm2` to manage and daemonize the project.
  - `pm2` will now restart the app automatically if it crashes or is killed, but not on system startup.
7. `pm2 startup systemd`
  - The last line of the output is the command you need to run with `sudo`. After running that command `systemd` will run `pm2` for your user on boot and `pm2` will run your node application
8. Modify `/etc/nginx/sites-available/default` and in the `location /` block, change the localhost port to match what the node app listens on (`3683`)
9. Make sure the configuration is error free by running `sudo nginx -t` and then restart nginx with `sudo systemctl restart nginx`

## `pm2` Production Notes

#### View Logs (Useful for debugging)
```bash
pm2 logs freeso-dashboard-api [--lines 1000]
```

#### Stop an application
```bash
pm2 stop freeso-dashboard-api
```

#### Restart an application
```bash
pm2 restart freeso-dashboard-api
```

#### List applications managed by `pm2`
```bash
pm2 list
```

#### Get more information about a specific application
```bash
pm2 info freeso-dashboard-api
```

#### Display the `pm2` process monitor
```bash
pm2 monit
```
